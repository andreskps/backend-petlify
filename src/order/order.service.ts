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
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { address } = createOrderDto;

    let subtotal = 0;

    const priceShipping = await this.calculateShippingPrice(createOrderDto);

    return this.orderRepository.manager.transaction(
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

        await transactionalEntityManager.save(order);

        return order;
      },
    );
  }

  async findAll() {
    const orders = await this.orderRepository.find();

    return orders;
  }

  async findOne(id: number) {
       const order = await  this.orderRepository.createQueryBuilder('order')
       .leftJoinAndSelect('order.orderAddress','orderAddress')
       .leftJoinAndSelect('orderAddress.municipio','municipio')
       .leftJoinAndSelect('order.orderItems','orderItems')
       .leftJoinAndSelect('orderItems.productVariant','productVariant')


       .where('order.id = :id',{id})

       .getOne();


       if(!order){
         throw new NotFoundException(`Order #${id} not found`)
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
