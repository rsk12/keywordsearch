import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Picture } from '../../models/picture-model';
//import { VISION_API_KEY  } from './access-config';
import { environment as ENV } from '../../environment'

export interface TextExtracter {
  extractText(picture: Picture): Promise<string>;
  extractLbel(picture: Picture): Promise<string>;
}

@Injectable()
export class OcrProvider implements TextExtracter {
  private static BASE_VISION_API_URL= "https://vision.googleapis.com/v1/images:annotate?key=";

  constructor(private httpClient: HttpClient) {
    this.getDocumentTextRequestBody = this.getDocumentTextRequestBody.bind(this);
    this.makeVisionRequest = this.makeVisionRequest.bind(this);
    this.handleTextResponse = this.handleTextResponse.bind(this);
    this.handleLogoResponse = this.handleLogoResponse.bind(this);
  }

  extractText(picture: Picture): Promise<string> {
     const req = this.getDocumentTextRequestBody(picture.name, [VisionFeatureType.DOCUMENT_TEXT_DETECTION]);
    return this.makeVisionRequest(req).then(this.handleTextResponse);
;
  }

  extractLbel(picture: Picture): Promise<string> {
    const req = this.getDocumentTextRequestBody(picture.name, [VisionFeatureType.LOGO_DETECTION]);
    return this.makeVisionRequest(req).then(this.handleLogoResponse);
  }

  private getDocumentTextRequestBody(base64: string, featureTypes: VisionFeatureType[]): VisionRequestBody {
    return {
      requests: [{
        image: {
          content: base64
        },
        features: featureTypes.map(type => ({
          type,
          maxResults: 1
        }))
      }]
    }
  }

  private makeVisionRequest(requestBody): Promise<VisionResponse> {
    const url = this.visionApiUrl();

    return this
      .httpClient
      .post(url, requestBody)
      .toPromise() as Promise<VisionResponse>;
  }

  private visionApiUrl(): string {
    return `${OcrProvider.BASE_VISION_API_URL}${ENV.VISION_API_KEY}`;
  }

  private handleTextResponse(visionResponse: VisionResponse): string {
    const { responses: [firstResponse] } = visionResponse;

    return firstResponse.fullTextAnnotation.text;
  }

  private handleLogoResponse(visionResponse: VisionResponse): string {
    console.log("logo response", JSON.stringify(visionResponse));

    const { responses: [firstResponse] } = visionResponse;

    if (this.doesNotHaveLogoAnnotations(firstResponse)) {
      return (new Date()).toString();
    }

    const { logoAnnotations } = firstResponse;

    return logoAnnotations[0].description;
  }

  private doesNotHaveLogoAnnotations(response: AnnotateImageResponse) {
    return !response || !response.logoAnnotations || !response.logoAnnotations.length;
  }
}

// https://cloud.google.com/vision/docs/request
interface VisionRequestBody {
  requests: AnnotateImageRequest[]
}

// https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#AnnotateImageRequest
interface AnnotateImageRequest {
  image: VisionImage,
  features: VisionFeature[],
}

// https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#Image
interface VisionImage {
  content: string,
}

// https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#Feature
interface VisionFeature {
  type: VisionFeatureType,
  maxResults: number
}

// https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#Type
enum VisionFeatureType {
  DOCUMENT_TEXT_DETECTION = "DOCUMENT_TEXT_DETECTION",
  LOGO_DETECTION = "LOGO_DETECTION"
}

interface VisionResponse {
  responses: AnnotateImageResponse[]
}

// https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#AnnotateImageResponse
interface AnnotateImageResponse {
  fullTextAnnotation: TextAnnotation,
  logoAnnotations: EntityAnnotation[]
}

// https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#TextAnnotation
interface TextAnnotation {
  text: string
}

// https://cloud.google.com/vision/docs/detecting-logos
interface EntityAnnotation {
  description: string
}
