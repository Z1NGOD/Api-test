import { Expose, Transform } from "class-transformer";

interface ValuesProps {
    obj: {
        _id: string;
    };
}

export class UserDto {
    @Expose()
    @Transform((value: ValuesProps) => value.obj._id.toString())
    _id: string;
    @Expose()
    name: string;
    @Expose()
    mobile: string;
    @Expose()
    email: string;
    @Expose()
    role: string;
    @Expose()
    favourites: [];
}
