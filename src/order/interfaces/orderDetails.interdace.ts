export interface OrdenDetails {
    id: number;
    name: string;
    lastName: string;
    phone: string;
    email: string;
    namePet: string;
    priceShipping: number;
    total: number;
    orderStatus: string;
    paymentMethod: string;
    createdAt: Date;
  
    orderAddress: {
      address: string;
      neighborhood?: string;
      instructions?: string;
      municipio: {
        name: string;
        state: {
          name: string;
        }
      }
    }
  
    orderItems: {
      quantity: number;
      unitPrice: number;
      productVariant: {
        product: {
          name: string;
          image: {
            url: string;
          }
        };
        attributes: {
          name: string;
          value: string;
        }[];
      };
    }[];
  }
  