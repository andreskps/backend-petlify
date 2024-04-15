import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Attribute } from 'src/products/entities/attribute.entity';
import { AttributeOption } from 'src/products/entities/attribute-option.entity';

@Injectable()
export class VariantsService {

  constructor(
    
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
    @InjectRepository(AttributeOption)
    private readonly attributeOptionRepository: Repository<AttributeOption>,

  ) {
     
  }


  async createVariant(createVariantDto: CreateVariantDto) {
    const product = await this.productRepository.findOne({
      where: {
        id: createVariantDto.productId,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    let attribute = await this.attributeRepository.findOne({
      where: { name: createVariantDto.attribute },
    });
    if (!attribute) {
      attribute = await this.attributeRepository.save({
        name: createVariantDto.attribute,
      });
    }

    let option = await this.attributeOptionRepository.findOne({
      where: { value: createVariantDto.value, attribute: attribute },
    });
    if (!option) {
      option = await this.attributeOptionRepository.save({
        value: createVariantDto.value,
        attribute: attribute,
      });
    }

    const productVariant = await this.productVariantRepository.save({
      price: createVariantDto.price,
      stock: createVariantDto.stock,
      product: product,
      option: option,
    });

    return productVariant;
  }

  findAll() {
    return `This action returns all variants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} variant`;
  }

  async updateVariant(id: number, updateVariantDto: UpdateVariantDto) {
    const variant = await this.productVariantRepository.findOne({
      where: {
        id: id,
      },
      relations: ['option', 'option.attribute'],
    });

    if (!variant) {
      throw new NotFoundException(`Variant not found`);
    }

    let attribute;
    if (updateVariantDto.attribute) {
      attribute = await this.attributeRepository.findOne({
        where: { name: updateVariantDto.attribute },
      });
      if (!attribute) {
        attribute = await this.attributeRepository.save({
          name: updateVariantDto.attribute,
        });
      }
    }

    let option;
    if (updateVariantDto.value) {
      option = await this.attributeOptionRepository.findOne({
        where: { value: updateVariantDto.value, attribute: attribute },
      });
      if (!option) {
        option = await this.attributeOptionRepository.save({
          value: updateVariantDto.value,
          attribute: attribute,
        });
      }
    }

    // const attributeOptionVariant = variant.attributeOptionVariants.find(aov => aov.option.attribute.id === attribute.id);

    variant.price = updateVariantDto.price;
    variant.stock = updateVariantDto.stock;
    variant.option = option;

    await this.productVariantRepository.save(variant);

    return variant;
  }

  remove(id: number) {
    return `This action removes a #${id} variant`;
  }
}
