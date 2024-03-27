import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { Attribute } from './entities/attribute.entity';
import { AttributeOption } from './entities/attribute-option.entity';
import { AttributeOptionVariant } from './entities/attributeOptionVariant.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
    @InjectRepository(AttributeOption)
    private readonly attributeOptionRepository: Repository<AttributeOption>,
    @InjectRepository(AttributeOptionVariant)
    private readonly attributeOptionVariantRepository: Repository<AttributeOptionVariant>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create({
      ...createProductDto,
      category: { id: createProductDto.subCategoryId },
    });
    const savedProduct = await this.productRepository.save(product);

    for (const variant of createProductDto.variants) {
      let attribute = await this.attributeRepository.findOne({
        where: { name: variant.attribute },
      });
      if (!attribute) {
        attribute = await this.attributeRepository.save({
          name: variant.attribute,
        });
      }

      let option = await this.attributeOptionRepository.findOne({
        where: { value: variant.value, attribute: attribute },
      });
      if (!option) {
        option = await this.attributeOptionRepository.save({
          value: variant.value,
          attribute: attribute,
        });
      }

      const productVariant = await this.productVariantRepository.save({
        price: variant.price,
        stock: variant.stock,
        product: savedProduct,
      });
      await this.attributeOptionVariantRepository.save({
        option: option,
        variant: productVariant,
      });
    }

    return savedProduct;
  }

  findAll() {
    return `This action returns all products`;
  }

  

       


  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
      relations: ['productVariants','productVariants.attributeOptionVariants.option.attribute'],
    })
  
    if (!product) {
      throw new NotFoundException(`Product not found`);
    }
  
    const mappedProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      slug: product.slug,
      isActive: product.isActive,
      isPopular: product.isPopular,
      variants: product.productVariants.map(variant => ({
        id: variant.id,
        price: variant.price,
        stock: variant.stock,
        attributes: variant.attributeOptionVariants.reduce((acc, aov) => {
          acc[aov.option.attribute.name] = aov.option.value;
          return acc;
        }, {}),
      })),
    };
  
    return mappedProduct;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
