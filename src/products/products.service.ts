import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from '../variants/entities/product-variant.entity';
import { Attribute } from './entities/attribute.entity';
import { AttributeOption } from './entities/attribute-option.entity';
import { AttributeOptionVariant } from './entities/attributeOptionVariant.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProductImage } from './entities/ProductImage';
import { QueryProductDto } from './dto/queries..dto';

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
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly cloudinaryService: CloudinaryService,
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
      ...(createProductDto.discountId
        ? { discount: { id: createProductDto.discountId } }
        : {}),
    });
    const savedProduct = await this.productRepository.save(product);

    if (createProductDto.images) {
      await this.saveImages(createProductDto.images, savedProduct);
    }

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

  findAll(query: QueryProductDto) {
    const { filter, brand, subcategory } = query;

    console.log(query);
    let queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true });
    // .leftJoinAndSelect('product.subCategory', 'subCategory')
    // .leftJoinAndSelect('subCategory.category', 'category');

    if (subcategory) {
      queryBuilder = queryBuilder
        .leftJoin('product.subCategory', 'subCategory')
        .andWhere('subCategory.name = :subCategoryName', {
          subCategoryName: subcategory,
        });
    }

    if (brand) {
      queryBuilder = queryBuilder
        .leftJoin('product.brand', 'brand')
        .andWhere('brand.name = :brandName', { brandName: brand });
    }

    if (filter) {
      if (filter === 'isPopular') {
        queryBuilder = queryBuilder.andWhere('product.isPopular = :isPopular', {
          isPopular: true,
        });
      } else if (filter === 'IsNew') {
        // Aquí puedes agregar la lógica para filtrar por 'IsNew'
      } else if (filter === 'All') {
        // Aquí puedes agregar la lógica para filtrar por 'All'
      }
    }

    const products = queryBuilder.getMany();

    return products;
  }

  async findPopular() {
    const products = await this.productRepository.find({
      where: {
        isPopular: true,
        isActive: true
      },
      relations: ['productImages'],
      take:6

    });
    return products;
  }

  async findAllAdmin() {
    const products = await this.productRepository.find({
      // relations: ['subCategory', 'subCategory.category'],
    });

    return products;
  }

  async findOne(id: string) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.category', 'category')
      .leftJoinAndSelect('product.productImages', 'productImages')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.discount', 'discount')
      .leftJoinAndSelect('product.pet', 'pet')
      .leftJoinAndSelect(
        'product.productVariants',
        'productVariants',
        'productVariants.isActive = :isActive',
        { isActive: true },
      )
      .leftJoinAndSelect('productVariants.option', 'option')
      .leftJoinAndSelect('option.attribute', 'attribute')
      .where('product.id = :id', { id })
      .getOne();

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    const mappedProduct = {
      id: product.id,
      title: product.title,
      categoryId: product.subCategory.category.id,
      subCategoryId: product.subCategory.id,
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
      images: product.productImages,
    };

    if (product.brand) {
      mappedProduct['brandId'] = product.brand.id;
    }

    if (product.discount) {
      mappedProduct['discountId'] = product.discount.id;
    }


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
        ...(updateProductDto.discountId !== undefined
          ? { discount: updateProductDto.discountId ? { id: updateProductDto.discountId } : null }
          : {}),
    });

    if (!productUpdate) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    const savedProduct = await this.productRepository.save(productUpdate);

    if (updateProductDto.images) {
      await this.saveImages(updateProductDto.images, savedProduct);
    }

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

  async findOneBySlug(slug: string) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.category', 'category')
      .leftJoinAndSelect('product.productImages', 'productImages')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.discount', 'discount')
      .leftJoinAndSelect('product.pet', 'pet')
      .leftJoinAndSelect(
        'product.productVariants',
        'productVariants',
        'productVariants.isActive = :isActive',
        { isActive: true },
      )
      .leftJoinAndSelect('productVariants.option', 'option')
      .leftJoinAndSelect('option.attribute', 'attribute')
      .where('product.slug = :slug', { slug })
      .getOne();

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    const mappedProduct = {
      id: product.id,
      title: product.title,
      categoryId: product.subCategory.category.id,
      subCategoryId: product.subCategory.id,
      petId: product.pet ? product.pet.id : null,
      description: product.description,
      slug: product.slug,
      isActive: product.isActive,
      isPopular: product.isPopular,
      isLowStock: product.isLowStock,
      variants: product.productVariants.map((variant) => ({
        id: variant.id,
        price: +variant.price,
        stock: variant.stock,
        attribute: variant.option.attribute.name,
        value: variant.option.value,
      })),
      discount: {
        id: product.discount ? product.discount.id : null,
        percentage: product.discount ? product.discount.percentage : null,
      },
      images: product.productImages,
    };

    if (product.brand) {
      mappedProduct['brandId'] = product.brand.id;
    }

    return mappedProduct;
  }

  async findAllByPet(pet: string, query: QueryProductDto) {
    const { filter, brand, subcategory,page=1,limit=10 } = query;

    let queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .skip((page-1)*limit)
      .take(limit)
      .where('product.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('product.discount', 'discount')
      .leftJoinAndSelect('product.productImages', 'productImages')
      .leftJoinAndSelect('product.productVariants', 'productVariants')
      .leftJoin('product.pet', 'pet')
      .andWhere('pet.name = :petName', { petName: pet });

    if (subcategory) {
      queryBuilder = queryBuilder
        .leftJoin('product.subCategory', 'subCategory')
        .andWhere('subCategory.name = :subCategoryName', {
          subCategoryName: subcategory,
        });
    }

    if (brand && brand !== 'all') {
      queryBuilder = queryBuilder
        .leftJoin('product.brand', 'brand')
        .andWhere('brand.name = :brandName', { brandName: brand });
    }

    if (filter) {
      if (filter === 'isPopular') {
        queryBuilder = queryBuilder.andWhere('product.isPopular = :isPopular', {
          isPopular: true,
        });
      } else if (filter === 'IsNew') {
        // Aquí puedes agregar la lógica para filtrar por 'IsNew'
      } else if (filter === 'All') {
        // Aquí puedes agregar la lógica para filtrar por 'All'
      }
    }

    const products = await queryBuilder.getMany();
    const total = await queryBuilder.getCount();

    return {
      products,
      total,
    };
  }

  async findAllByCategory(slug: string, query: QueryProductDto) {
    const { filter, pet, subcategory,page=1,limit=10 } = query;

    let queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .skip((page-1)*limit)
      .take(limit)
      .where('product.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('product.productImages', 'productImages')
      .leftJoinAndSelect('product.discount', 'discount')
      .leftJoinAndSelect('product.productVariants', 'productVariants')
      .leftJoin('product.subCategory', 'subCategory')
      .leftJoin('subCategory.category', 'category')
      .andWhere('category.name = :categoryName', { categoryName: slug });

    if (pet && pet !== 'all') {
      queryBuilder = queryBuilder
        .leftJoin('product.pet', 'pet')
        .andWhere('pet.name = :petName', { petName: pet });
    }

    if (subcategory && subcategory !== 'all') {
      queryBuilder = queryBuilder.andWhere(
        'subCategory.name = :subCategoryName',
        {
          subCategoryName: subcategory,
        },
      );
    }

    if (filter) {
      if (filter === 'isPopular') {
        queryBuilder = queryBuilder.andWhere('product.isPopular = :isPopular', {
          isPopular: true,
        });
      } else if (filter === 'IsNew') {
        // Aquí puedes agregar la lógica para filtrar por 'IsNew'
      } else if (filter === 'All') {
        // Aquí puedes agregar la lógica para filtrar por 'All'
      }
    }

    const products = await queryBuilder.getMany();
    const total = await queryBuilder.getCount();

    return {
      products,
      total,
    };
  }

  async uploadImages(files: Express.Multer.File[]) {
    try {
      const response = await this.cloudinaryService.uploadFiles(
        files,
        'products',
      );
      return response.map((file) => file.url);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteImage(id: number) {
    const productImage = await this.productImageRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!productImage) {
      throw new NotFoundException(`Image not found`);
    }
    try {
      await Promise.all([
        this.productImageRepository.remove(productImage),
        this.cloudinaryService.destroyFile(productImage.url),
      ]);

      return { message: 'Image deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private async saveImages(images: string[], product: Product) {
    for (const url of images) {
      const productImage = this.productImageRepository.create({
        url,
        product,
      });

      await this.productImageRepository.save(productImage);
    }
  }
}
