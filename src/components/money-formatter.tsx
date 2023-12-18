import { useMounted } from "~/hook/use-mounted";
import { moneyFormatter } from "~/utils/string-utils";

interface MoneyFormatterProps {
    value: number;
}
const MoneyFormatter: React.FC<MoneyFormatterProps> = (props) => {
    const { mounted } = useMounted();
    return <>{mounted && moneyFormatter(props.value)}</>;
};
export default MoneyFormatter;
