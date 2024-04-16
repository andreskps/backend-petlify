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
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
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
    };

    if (product.brand) {
      mappedProduct['brandId'] = product.brand.id;
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
