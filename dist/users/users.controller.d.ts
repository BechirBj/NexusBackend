import { UsersService } from "./users.service";
export declare class UsersController {
    private users;
    constructor(users: UsersService);
    get(id: string): Promise<import("./user.entity").User>;
    getAll(): Promise<import("./user.entity").User[]>;
    qq(): string;
    delete(id: string): Promise<void>;
}
