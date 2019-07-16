import { TextExtracter } from "../src/providers/ocr/ocr";
import { Picture } from "../src/models/picture-model";

export class OcrProviderMock implements TextExtracter {
  static EXTRACTED_LABEL: string = 'Test Label';

  extractText(picture: Picture): Promise<string> {
    return Promise.resolve(`Daily Hydrating Vitamin E & Avocado Protects and defends skin from
    dryness for healthy looking skin. This creamy, non-greasy formula containing Vitamin E and Avocado provides
    immediate moisturization, softening dry skin. Apply daily to achieve the soft, smooth, he Cthy look and feel
    that your skin d. 'N OUR PHILOSOPHY St. Ives is dedicated. Sy you the best of nature with Laulas that
    delight the senses as they leave your skin with a radiant, soft and fresh feel. a suitable for Sensitive
    Skin a Dermatologist Tested. Paraben Free Does Not Contain Animal Ingredients Made with 100% Natural
    Moisturizers (Vegetable Glycerin, Soy Bean Oil) Learn about our products at Stives.com Directions: Massage
    gently into clean, dry skin. Apply daily. Continued use improves skin moisturization. WARNING: USE ONLY AS
    DIRECTED. AVOID CONTACT WITH EYES. IF EYE CONTACT OCCURS IMMEDIATELY RINSE WITH WATER. IF RASH OR IRRITATION
    OCCURS, DISCONTINUE USE. INGREDIENTS: WATER (AQUA), GLYCERIN, STEARIC ACID, GLYCINE SI SOYBEAN) OIL, GLYCOL
    STEARATE, DIMETHICONE, GLYCERYL STEARATE TRIETHANOLAMÍNE, CETYL ALCOHOL, CAPRYLYL GLYCOL, PHENOX FRAGRANCE
    (PARFUM), CARBOMER, HYDROXYETHYLCELLULOSE, EDIA, BHT, STEARAMIDE AMP, TOCOPHERYL ACETATE, PERSEA GRATISSI.
    (AVOCADO) OIL. ZMES BY Unilever 08031|| QINII Furn
    Sunflower`);
  }

  extractLbel(picture: Picture): Promise<string> {
    return Promise.resolve(OcrProviderMock.EXTRACTED_LABEL);
  }
}
