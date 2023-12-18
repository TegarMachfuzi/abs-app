/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Food } from "@prisma/client";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { Cart, Props } from "~/type";

const useCartController = () => {
    const [carts, setCarts] = useState<Cart[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [totalItem, setTotalItem] = useState<number>(0);
    const [tax, setTax] = useState<number>(0);
    const updateCart = useCallback(
        (food: Food, count: number) => {
            const cart = carts.find((item) => item.id === food.id);
            if (!cart) {
                setCarts([...carts, { ...food, total: count }]);
                return;
            }
            setCarts(
                carts.map((item) => {
                    if (item.id === food.id) {
                        return { ...food, total: count + item.total };
                    }
                    return item;
                })
            );
        },
        [carts]
    );
    const removeCart = useCallback(
        (food: Food) => {
            setCarts(carts.filter((item) => item.id !== food.id));
        },
        [carts]
    );
    useEffect(() => {
        setTotalItem(carts.reduce((a, b) => a + b.total, 0));
        setTotalPrice(carts.reduce((a, b) => a + b.price * b.total, 0));
    }, [carts]);
    useEffect(() => {
        setTax((totalPrice * 10) / 100);
    }, [totalPrice]);
    return { carts, totalPrice, totalItem, updateCart, removeCart, tax };
};
const CartContext = createContext<ReturnType<typeof useCartController>>({
    carts: [],
    updateCart: (_food: Food, _count: number) => {},
    removeCart: (_food: Food) => {},
    totalPrice: 0,
    totalItem: 0,
    tax: 0,
});

export const CartProvider = ({ children }: Props) => {
    return (
        <CartContext.Provider value={useCartController()}>
            {children}
        </CartContext.Provider>
    );
};
export const useCart = () => useContext(CartContext);
