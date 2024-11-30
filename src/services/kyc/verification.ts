import axios from 'axios';

export interface KYCDocument {
  type: 'passport' | 'driving_license' | 'national_id';
  frontImage: File;
  backImage?: File;
  selfieImage: File;
}

export interface KYCData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  residenceCountry: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  documents: KYCDocument[];
}

export type VerificationStatus = 
  | 'pending'
  | 'in_progress'
  | 'additional_info_required'
  | 'approved'
  | 'rejected';

export interface VerificationResult {
  id: string;
  status: VerificationStatus;
  message?: string;
  completedAt?: Date;
}

export class KYCVerificationService {
  private static readonly API_URL = process.env.NEXT_PUBLIC_KYC_API_URL;
  private static readonly API_KEY = process.env.KYC_API_KEY;

  private constructor() {}

  static async submitVerification(
    userId: string,
    data: KYCData
  ): Promise<VerificationResult> {
    try {
      // Upload documents first
      const documentUrls = await this.uploadDocuments(data.documents);
      
      // Submit verification request
      const response = await axios.post(
        `${this.API_URL}/verifications`,
        {
          userId,
          personalInfo: {
            fullName: data.fullName,
            dateOfBirth: data.dateOfBirth,
            nationality: data.nationality,
            residenceCountry: data.residenceCountry,
            address: data.address,
          },
          documents: documentUrls,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        id: response.data.id,
        status: 'pending',
        message: 'Verification submitted successfully',
      };
    } catch (error) {
      console.error('KYC verification submission failed:', error);
      throw new Error('KYC verification submission failed: ' + error.message);
    }
  }

  static async checkVerificationStatus(
    verificationId: string
  ): Promise<VerificationResult> {
    try {
      const response = await axios.get(
        `${this.API_URL}/verifications/${verificationId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
          },
        }
      );

      return {
        id: verificationId,
        status: response.data.status,
        message: response.data.message,
        completedAt: response.data.completedAt ? new Date(response.data.completedAt) : undefined,
      };
    } catch (error) {
      console.error('KYC status check failed:', error);
      throw new Error('KYC status check failed: ' + error.message);
    }
  }

  static async uploadDocuments(
    documents: KYCDocument[]
  ): Promise<{ [key: string]: string }> {
    try {
      const uploadPromises = documents.map(async (doc) => {
        const formData = new FormData();
        formData.append('type', doc.type);
        formData.append('front', doc.frontImage);
        if (doc.backImage) {
          formData.append('back', doc.backImage);
        }
        formData.append('selfie', doc.selfieImage);

        const response = await axios.post(
          `${this.API_URL}/documents/upload`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${this.API_KEY}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        return {
          type: doc.type,
          url: response.data.url,
        };
      });

      const uploadedDocs = await Promise.all(uploadPromises);
      
      return uploadedDocs.reduce((acc, doc) => {
        acc[doc.type] = doc.url;
        return acc;
      }, {} as { [key: string]: string });
    } catch (error) {
      console.error('Document upload failed:', error);
      throw new Error('Document upload failed: ' + error.message);
    }
  }

  static async requestAdditionalInfo(
    verificationId: string,
    documents: KYCDocument[]
  ): Promise<VerificationResult> {
    try {
      const documentUrls = await this.uploadDocuments(documents);
      
      const response = await axios.post(
        `${this.API_URL}/verifications/${verificationId}/additional-info`,
        {
          documents: documentUrls,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        id: verificationId,
        status: 'in_progress',
        message: 'Additional information submitted successfully',
      };
    } catch (error) {
      console.error('Additional info submission failed:', error);
      throw new Error('Additional info submission failed: ' + error.message);
    }
  }

  static validateDocuments(documents: KYCDocument[]): boolean {
    // Implement document validation logic
    const requiredTypes = ['passport', 'driving_license', 'national_id'];
    const hasRequiredDoc = documents.some(doc => 
      requiredTypes.includes(doc.type)
    );

    if (!hasRequiredDoc) {
      throw new Error('At least one government-issued ID is required');
    }

    // Validate file types and sizes
    for (const doc of documents) {
      if (!this.isValidFileType(doc.frontImage)) {
        throw new Error(`Invalid file type for ${doc.type} front image`);
      }
      if (doc.backImage && !this.isValidFileType(doc.backImage)) {
        throw new Error(`Invalid file type for ${doc.type} back image`);
      }
      if (!this.isValidFileType(doc.selfieImage)) {
        throw new Error(`Invalid file type for ${doc.type} selfie image`);
      }
    }

    return true;
  }

  private static isValidFileType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heif', 'application/pdf'];
    return allowedTypes.includes(file.type);
  }
} 