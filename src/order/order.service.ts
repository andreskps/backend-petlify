import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderAddress } from './entities/orderAddress.entity';
import { EntityManager, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { ProductVariant } from 'src/variants/entities/product-variant.entity';
import { Municipio } from 'src/municipios/entities/municipio.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { PaymentMethod } from './enums/paymentMethod.enum';
import { OrderStatus } from './enums/orderStatus.enum';
import { OrdenDetails } from './interfaces/OrderDetails.interdace';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderAddress)
    private orderAddressRepository: Repository<OrderAddress>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(Municipio)
    private municipioRepository: Repository<Municipio>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,

    private readonly emailService: EmailService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { address } = createOrderDto;

    let subtotal = 0;

    const priceShipping = await this.calculateShippingPrice(createOrderDto);

    const orderSave= await this.orderRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const orderItemsPromises = createOrderDto.variants.map(
          async (variant) => {
            const productVariant = await transactionalEntityManager.findOne(
              ProductVariant,
              {
                where: { id: variant.id },
                relations: ['product', 'product.discount'],
              },
            );

            const discount = productVariant.product.discount?.percentage || 0;

            const unitPrice =
              productVariant.price - (productVariant.price * discount) / 100;
            const total = unitPrice * variant.quantity;

            const orderItem = this.orderItemRepository.create({
              productVariant,
              quantity: variant.quantity,
              unitPrice,
              price: productVariant.price,
              total,
            });

            await transactionalEntityManager.save(orderItem);
            subtotal += total;

            return orderItem;
          },
        );

        const orderItems = await Promise.all(orderItemsPromises);

        const orderAddress = this.orderAddressRepository.create(address);

        const savedOrderAddress = await transactionalEntityManager.save(
          OrderAddress,
          {
            ...orderAddress,
            municipio: {
              id: address.municipioId,
            },
          },
        );

        let coupon = null;
        if (createOrderDto.coupon) {
          const discount = await this.calculateCouponDiscount(
            createOrderDto.coupon,
            subtotal,
          );

          subtotal -= (subtotal * discount) / 100;

          coupon = await this.couponRepository.findOne({
            where: { code: createOrderDto.coupon, isActive: true },
          });
        }

        const order = this.orderRepository.create({
          orderItems,
          paymentMethod: this.getPayMethod(createOrderDto.paymentMethod),
          totalAmount: subtotal + priceShipping,
          orderAddress: savedOrderAddress,
          priceShipping: priceShipping,
          name: createOrderDto.name,
          lastName: createOrderDto.lastName,
          email: createOrderDto.email,
          phone: createOrderDto.phone,
          namePet: createOrderDto.namePet,
          coupon: coupon,
        });

  

        const orderNew = await transactionalEntityManager.save(order);

      return orderNew;

      },
    );

    const orderDetails = await this.findOne(orderSave.id);

    this.emailService.sendEmailOrder(orderDetails);



    return orderSave;



  }

  private async sendEmailOrder(orderDetails: OrdenDetails) {
    return this.emailService.sendEmailOrder(orderDetails);
  }

  async findAll() {
    const orders = await this.orderRepository.find();

    return orders;
  }

  async findOne(id: number): Promise<OrdenDetails> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderAddress', 'orderAddress')
      .leftJoinAndSelect('orderAddress.municipio', 'municipio')
      .leftJoinAndSelect('municipio.departamento', 'departamento')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.productVariant', 'productVariant')
      .leftJoinAndSelect('productVariant.product', 'product')
      .leftJoinAndSelect('productVariant.option', 'option')
      .leftJoinAndSelect('option.attribute', 'attribute')
      .leftJoinAndSelect('product.productImages', 'productImages')
      .where('order.id = :id', { id })
      .getOne();

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    // Mapping the order object to OrdenDetails
    const mappedOrder: OrdenDetails = {
      id: order.id,
      name: order.name,
      lastName: order.lastName,
      phone: order.phone,
      email: order.email,
      namePet: order.namePet,
      priceShipping: order.priceShipping,
      total: order.totalAmount,
      orderStatus: order.orderStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdDate,
      orderAddress: {
        address: order.orderAddress.address,
        neighborhood: order.orderAddress.neighborhood,
        instructions: order.orderAddress.addressDetail,
        municipio: {
          name: order.orderAddress.municipio.name,
          state: {
            name: order.orderAddress.municipio.departamento.name,
          },
        },
      },
      orderItems: order.orderItems.map((item) => ({
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        productVariant: {
          product: {
            name: item.productVariant.product.title,
            image: {
              url: item.productVariant.product.productImages[0].url,
            },
          },
          attributes: [
            {
              name: item.productVariant.option.attribute.name,
              value: item.productVariant.option.value,
            },
          ],
        },
      })),
    };

    return mappedOrder;
  }

  async findStatusOrder(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id: id },
      select: ['orderStatus'],
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const { paymentMethod, coupon, orderStatus, ...rest } = updateOrderDto;
    const order = await this.orderRepository.preload({
      id: id,
      ...rest,
      // coupon: { code: coupon },
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    if (orderStatus) {
      order.orderStatus = this.getOrderStatus(orderStatus);
    }

    return await this.orderRepository.save(order);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async calculateShippingPrice(createOrderDto: CreateOrderDto) {
    const { address } = createOrderDto;

    const municipio = await this.municipioRepository.findOne({
      where: { id: address.municipioId },
    });

    return municipio.priceShipping;
  }

  private async calculateCouponDiscount(code: string, subTotal: number) {
    const coupon = await this.couponRepository.findOne({
      where: { code, isActive: true },
    });

    if (!coupon) {
      return 0;
    }

    if (subTotal < coupon.minimumAmount) {
      return 0;
    }

    return coupon.percentage;
  }

  private getPayMethod(method: string) {
    const paymentMethodKey = Object.keys(PaymentMethod).find(
      (key) => PaymentMethod[key as keyof typeof PaymentMethod] === method,
    );

    if (!paymentMethodKey) {
      throw new Error(`Invalid payment method: ${method}`);
    }

    const paymentMethod =
      PaymentMethod[paymentMethodKey as keyof typeof PaymentMethod];

    return paymentMethod;
  }

  private getOrderStatus(status: string) {
    const orderStatusKey = Object.keys(OrderStatus).find(
      (key) => OrderStatus[key as keyof typeof OrderStatus] === status,
    );

    if (!orderStatusKey) {
      throw new Error(`Invalid order status: ${status}`);
    }

    const orderStatus = OrderStatus[orderStatusKey as keyof typeof OrderStatus];

    return orderStatus;
  }
}
