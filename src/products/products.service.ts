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
import { UpdateVariantDto } from './dto/update-variant.dto';
import { CreateVariantDto } from './dto/create-variant.dto';

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
      subCategory: { id: createProductDto.subCategoryId },
      ...(createProductDto.brandId
        ? { brand: { id: createProductDto.brandId } }
        : {}),
      ...(createProductDto.petId
        ? { pet: { id: createProductDto.petId } }
        : {}),
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
        option: option,
      });
    }

    return savedProduct;
  }

  findAll() {
    return `This action returns all products`;
  }

  async findAllAdmin() {
    const products = await this.productRepository.find({
      // relations: ['subCategory', 'subCategory.category'],
    });

    return products;
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
      relations: [
        'subCategory',
        'subCategory.category',
        'productVariants',
        'productVariants.option',
        'productVariants.option.attribute',
        'brand',
        'pet',
      ],
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    const mappedProduct = {
      id: product.id,
      title: product.title,
      categoryId: product.subCategory.category.id,
      subCategoryId: product.subCategory.id,
      brandId: product.brand ? product.brand.id : null,
      petId: product.pet ? product.pet.id : null,
      description: product.description,
      slug: product.slug,
      isActive: product.isActive,
      isPopular: product.isPopular,
      variants: product.productVariants.map((variant) => ({
        id: variant.id,
        price: +variant.price,
        stock: variant.stock,
        attribute: variant.option.attribute.name,
        value: variant.option.value,
      })),
    };

    return mappedProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const productUpdate = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      ...(updateProductDto.subCategoryId
        ? { subCategory: { id: updateProductDto.subCategoryId } }
        : {}),
      ...(updateProductDto.brandId
        ? { brand: { id: updateProductDto.brandId } }
        : {}),
      ...(updateProductDto.petId
        ? { pet: { id: updateProductDto.petId } }
        : {}),
    });

    if (!productUpdate) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    const savedProduct = await this.productRepository.save(productUpdate);

    return savedProduct;
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    product.isActive = false;

    await this.productRepository.save(product);
  }

  async createVariant(productId: string, createVariantDto: CreateVariantDto) {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
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
}
