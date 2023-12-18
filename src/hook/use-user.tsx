/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { z } from "zod";
import { Props } from "~/type";

export const userSchema = z.object({
    id: z.number(),
    name: z.string(),
    avatar: z.string(),
});
export type UserType = z.infer<typeof userSchema>;

const SplitBillSchema = z.object({
    detailId: z.string(),
    names: z.array(
        userSchema.extend({
            quantity: z.number(),
        })
    ),
});
export type SplitBillType = z.infer<typeof SplitBillSchema>;
const useUserController = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [transactionOrder, setTransactionOrder] = useState("");
    const [splitBill, setSplitBill] = useState<SplitBillType[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

    const onSelectUser = (id: number) => {
        setSelectedUser(users.find((item) => item.id === id) ?? null);
    };

    const onUpdateBill = (detailId: string, user: string, count: number) => {
        if (selectedUser) {
            const b = splitBill.find((item) => item.detailId === detailId);
            if (b) {
                setSplitBill(
                    splitBill.map((item) => {
                        if (item.detailId === b.detailId) {
                            return {
                                ...item,
                                names: item.names.map((n) => {
                                    if (n.name === user) {
                                        return {
                                            ...n,
                                            quantity: n.quantity + count,
                                        };
                                    }
                                    return n;
                                }),
                            };
                        }
                        return item;
                    })
                );
            }
        }
    };
    const onActionBill = (detailId: string, user: string, active: boolean) => {
        if (selectedUser) {
            const b = splitBill.find((item) => item.detailId === detailId);
            if (b) {
                setSplitBill(
                    splitBill.map((item) => {
                        if (item.detailId === detailId) {
                            const filt = item.names;
                            if (!active) {
                                return {
                                    detailId: detailId,
                                    names: [
                                        ...filt.filter((f) => f.name !== user),
                                    ],
                                };
                            }
                            const us = users.find((u) => u.name === user);
                            if (us) {
                                filt.push({ ...us, quantity: 1 });
                            }

                            return {
                                detailId: detailId,
                                names: [...filt],
                            };
                        }
                        return item;
                    })
                );
                return;
            }
            const us = users.find((u) => u.name === user);
            if (us) {
                setSplitBill([
                    ...splitBill,
                    { detailId, names: [{ ...us, quantity: 1 }] },
                ]);
            }
        }
    };
    const updateUser = useCallback(
        (str: string, id: number) => {
            const us = users.map((item) => {
                if (item.id !== id) return item;
                return { ...item, name: str };
            });
            setUsers(us);
        },
        [users]
    );
    const addUser = useCallback(
        (user: UserType) => {
            setUsers([...users, user]);
        },
        [users]
    );
    const removeUser = useCallback(
        (id: number) => {
            setUsers(users.filter((item) => item.id !== id));
        },
        [users]
    );
    useEffect(() => {
        console.log("splitbill", splitBill);
    }, [splitBill]);
    return {
        users,
        removeUser,
        addUser,
        updateUser,
        transactionOrder,
        setTransactionOrder,
        splitBill,
        onSelectUser,
        onActionBill,
        selectedUser,
        onUpdateBill,
    };
};

const UserContext = createContext<ReturnType<typeof useUserController>>({
    users: [],
    addUser: (_user: UserType) => {},
    updateUser: (_name: string, _id: number) => {},
    removeUser: (_id: number) => {},
    transactionOrder: "",
    setTransactionOrder: () => {},
    splitBill: [],
    onSelectUser: (_id: number) => {},
    onActionBill: (_detailId: string, _user: string, _active: boolean) => {},
    onUpdateBill: (_detailId: string, _user: string, _count: number) => {},
    selectedUser: null,
});

export const UserProvider = ({ children }: Props) => {
    return (
        <UserContext.Provider value={useUserController()}>
            {children}
        </UserContext.Provider>
    );
};
export const useUser = () => useContext(UserContext);
