import { Injectable } from '@nestjs/common';
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

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
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
}
