import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AddToCartDto, EventViewContentDto } from './dto/create-pixel.dto';
// import { CreatePixelDto } from './dto/create-pixel.dto';

interface dataPurchase {
  user_data: {
    client_ip_address: string;
    client_user_agent: string;
    em: string[];
    fn: string;
    ph: string;
    ln: string;
  };
  custom_data: {
    currency: string;
    value: number;
    content_name: string;
    contents: { id: string; quantity: number }[];
    content_ids: string[];
  };
}

@Injectable()
export class PixelService {
  // create(createPixelDto: CreatePixelDto) {
  //   return 'This action adds a new pixel';
  // }

  async eventAddToCart(
    request: Request,
    addTocartDto: AddToCartDto,
    ip: string,
  ) {
    const apikey = process.env.API_KEY_PIXEL;

    const response = await fetch(
      `https://graph.facebook.com/v20.0/1116424846318536/events?access_token=${apikey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [
            {
              action_source: 'website',
              event_id: addTocartDto.event_id.toString(),
              event_name: 'AddToCart',
              event_time: addTocartDto.event_time,
              user_data: {
                client_ip_address: ip,
                client_user_agent: request.headers['user-agent'],
              },
              custom_data: {
                currency: addTocartDto.custom_data.currency,
                value: addTocartDto.custom_data.value,
                content_name: addTocartDto.custom_data.content_name,
                content_ids: addTocartDto.custom_data.content_ids,
              },
            },
          ],
          test_event_code: 'TEST35014',
        }),
      },
    );
  }

  async eventPurchase(dataPurchase: dataPurchase) {
    const apikey = process.env.API_KEY_PIXEL;

    const response = await fetch(
      `https://graph.facebook.com/v20.0/1116424846318536/events?access_token=${apikey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [
            {
              action_source: 'website',
              event_id: '4541',
              event_name: 'Purchase',
              event_time: Math.floor(Date.now() / 1000),
              user_data: {
                client_ip_address: dataPurchase.user_data.client_ip_address,
                client_user_agent: dataPurchase.user_data.client_user_agent,
                em: dataPurchase.user_data.em,
                fn: dataPurchase.user_data.fn,
                ph: dataPurchase.user_data.ph,
                ln: dataPurchase.user_data.ln,
              },
              custom_data: {
                currency: dataPurchase.custom_data.currency,
                value: dataPurchase.custom_data.value,
                content_name: dataPurchase.custom_data.content_name,
                content_ids: dataPurchase.custom_data.content_ids,
                contents: dataPurchase.custom_data.contents,
              },
            },
          ],
          test_event_code: 'TEST35014',
        }),
      },
    );

    const result = await response.json();

    return result;
  }

  async eventViewContent(
    request: Request,
    eventViewContentDto: EventViewContentDto,
    ip: string,
  ) {
    const apikey = process.env.API_KEY_PIXEL;

    const response = await fetch(
      `https://graph.facebook.com/v20.0/1116424846318536/events?access_token=${apikey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [
            {
              action_source: 'website',
              event_id: eventViewContentDto.event_id.toString(),
              event_name: 'ViewContent',
              event_time: eventViewContentDto.event_time, 
              user_data: {
                client_ip_address: ip,
                client_user_agent: request.headers['user-agent'],
              },
            },
          ],
          test_event_code: 'TEST35014',
        }),
      },
    );
  }
}
