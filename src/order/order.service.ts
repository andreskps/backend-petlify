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
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { variants } = createOrderDto;

    // async (transactionalEntityManager: EntityManager) => {

    //   const orderAddress = this.orderAddressRepository.create(createOrderDto.orderAddress)
    //   await transactionalEntityManager.save(orderAddress)

    //   const order = this.orderRepository.create({
    //     orderAddress,
    //     total: 0,
    //   })
    //   await transactionalEntityManager.save(order)

    //   let total = 0
    //   const orderItems = variants.map(async (variant) => {
    //     const productVariant = await this.productVariantRepository.findOne({
    //       where: { id: variant.id },
    //       relations: ['product', 'product.discount'],
    //     })
    //     const orderItem = this.orderItemRepository.create({
    //       order,
    //       productVariant,
    //       quantity: variant.quantity,
    //       price: productVariant.price,
    //     })
    //     total += orderItem.price * orderItem.quantity
    //     await transactionalEntityManager.save(orderItem)
    //   })

    //   order.total = total
    //   await transactionalEntityManager.save(order)
    // }

    // const productVariant = await this.productVariantRepository.findOne({
    //   where: { id: variants[0].id },
    //   relations: ['product', 'product.discount'],
    //   select: ['id', 'price', 'product'],
    // })

    // return productVariant

    const products = await Promise.all(
      variants.map(async (variant) => {
        const productVariant = await this.productVariantRepository.findOne({
          where: { id: variant.id },
          relations: ['product', 'product.discount'],
          select: ['id', 'price', 'product'],
        });
        return productVariant;
      }),
    );

    return products;

    // const items = variants.map(async (variant) => {
    //   const productVariant = await this.productVariantRepository.findOne({
    //     where: { id: variant.id },
    //     // relations: ['product', 'product.discount'],
    //   })
    //   // const orderItem = this.orderItemRepository.create({
    //   //   productVariant,
    //   //   quantity: variant.quantity,
    //   //   price: productVariant.price,
    //   // })
    //   return productVariant;
    // })

    // return items
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const { address } = createOrderDto;
  
    let subtotal = 0;
    let couponDiscount = 0;
  
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
  
        const savedOrderAddress = await transactionalEntityManager.save(OrderAddress, {
          ...orderAddress,
          municipio: {
            id: address.municipioId,
          },
        });
  
        const order = this.orderRepository.create({
          orderItems,
          totalAmount: subtotal + priceShipping - couponDiscount,
          orderAddress: savedOrderAddress,
          priceShipping: priceShipping,
          name: createOrderDto.name,
          lastName: createOrderDto.lastName,
          email: createOrderDto.email,
          phone: createOrderDto.phone,
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
}
