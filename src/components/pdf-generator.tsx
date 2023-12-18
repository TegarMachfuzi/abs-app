import { toPng } from "html-to-image";
import { Button } from "./ui/button";

import { jsPDF } from "jspdf";

type props = {
    html: React.MutableRefObject<HTMLDivElement | null>;
};
const PdfGenerator: React.FC<props> = ({ html }) => {
    const generateImage = async () => {
        if (html && html.current) {
            const image = await toPng(html.current, { quality: 0.95 });
            const doc = new jsPDF();

            doc.addImage(image, "JPEG", 5, 22, 200, 160);
            doc.save();
        }
    };
    return (
        <Button variant={"outline"} onClick={generateImage}>
            Export to pdf
        </Button>
    );
};
export default PdfGenerator;
