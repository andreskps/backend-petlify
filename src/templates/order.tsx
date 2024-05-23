import {
  Button,
  Html,
  Tailwind,
  Container,
  Body,
  Section,
  Row,
  Column,
} from '@react-email/components';
import { OrdenDetails } from 'src/order/interfaces/OrderDetails.interdace';
interface Props {
  code: string;
  name: string;
  url: string;
  orderDetails: OrdenDetails;
}

export default function Welcome({ name, code, url, orderDetails }: Props) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: '#007291',
            },
          },
        },
      }}
    >
      <Html>
        <Body>
          <Container className="w-full">
            <div className="bg-white">
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-orange-500">
                    ¡Gracias por tu pedido!
                  </h1>
                  <p className="text-gray-500 mt-2 ">
                    Hola {orderDetails.name} Hemos recibido tu pedido y estamos
                    trabajando para prepararlo lo antes posible.
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 p-4 mt-4">
                <Row>
                  <Column className="border-r-2 border-orange-500 px-4">
                    <h2 className="text-lg font-bold text-orange-500">
                      Detalles del pedido
                    </h2>
                    <p className="text-sm font-medium text-black">
                      Numero de pedido:{' '}
                      <span className="font-normal">#{orderDetails.id}</span>
                    </p>
                    <p className="text-sm font-medium text-black">
                      Fecha de pedido:{' '}
                      <span className="font-normal">
                        {orderDetails.createdAt}
                      </span>
                    </p>
                    <p className="text-sm font-medium text-black">
                      Estado del pedido:{' '}
                      <span className="font-normal">
                        {orderDetails.orderStatus}
                      </span>
                    </p>
                    <p className="text-sm font-medium text-black">
                      Método de pago:{' '}
                      <span className="font-normal">
                        {orderDetails.paymentMethod}
                      </span>
                    </p>
                    <p className="text-sm font-medium text-black">
                      Total:{' '}
                      <span className="font-normal">${orderDetails.total}</span>
                    </p>
                  </Column>
                </Row>

                <Row>
                  <Column className="px-4">
                    <h2 className="text-lg font-bold text-orange-500">
                      Información de envío
                    </h2>
                    <p className="text-sm font-medium text-black">
                      Nombre:{' '}
                      <span className="font-normal">
                        {orderDetails.name} {orderDetails.lastName}
                      </span>
                    </p>
                    <p className="text-sm font-medium text-black">
                      Teléfono:{' '}
                      <span className="font-normal">{orderDetails.phone}</span>
                    </p>
                    <p className="text-sm font-medium text-black">
                      Email:{' '}
                      <span className="font-normal">{orderDetails.email}</span>
                    </p>
                    <p className="text-sm font-medium text-black">
                      Dirección:{' '}
                      <span className="font-normal">
                        {orderDetails.orderAddress.address}
                      </span>
                    </p>
                    <p className="text-sm font-medium text-black">
                      Barrio:{' '}
                      <span className="font-normal">
                        {orderDetails.orderAddress.neighborhood}
                      </span>
                    </p>
                    <p className="text-sm font-medium text-black">
                      Instrucciones:{' '}
                      <span className="font-normal">
                        {orderDetails.orderAddress.instructions}
                      </span>
                    </p>
                    <p className="text-sm font-medium text-black">
                      Municipio:{' '}
                      <span className="font-normal">
                        {orderDetails.orderAddress.municipio.name}
                      </span>
                    </p>
                  </Column>
                </Row>
              </div>

              <h2 className="text-lg font-bold text-orange-500">Productos</h2>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="px-4 py-2">Producto</th>
                    <th className="px-4 py-2">Referencia</th>
                    <th className="px-4 py-2">Cantidad</th>
                    <th className="px-4 py-2">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.orderItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">
                        {item.productVariant.product.name}
                      </td>
                      <td className="px-4 py-2">
                        {item.productVariant.attributes.map(
                          (attribute, index) => (
                            <p key={index}>
                              {attribute.name}: {attribute.value}
                            </p>
                          ),
                        )}
                      </td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">${item.unitPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
