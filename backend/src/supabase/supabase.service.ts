// supabase.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // use service key for server-side uploads
    if (!url || !key) {
      throw new InternalServerErrorException('Supabase credentials are not set');
    }

    this.supabase = createClient(url, key);
  }

  /**
   * Uploads a file buffer to Supabase Storage and returns public URL
   */
  async uploadFile(path: string, fileBuffer: Buffer, mimeType?: string) {
    const bucketName = 'forms'; // your bucket
    const { data, error } = await this.supabase.storage
      .from(bucketName)
      .upload(path, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

      console.log('Supabase upload response:', data, error);

    if (error) {
      return { error };
    }

    // Generate public URL
    const { data: { publicUrl } } = this.supabase.storage.from(bucketName).getPublicUrl(path);
    return { data: { ...data, publicUrl } };
  }
}
