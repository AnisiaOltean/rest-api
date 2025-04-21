import { TypeOrmModule } from "@nestjs/typeorm";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Cat {
    @PrimaryGeneratedColumn()
    id: number 

    @Column()
    name: string 

    @Column()
    breed: string;

    @ManyToOne(() => User, (user) => user.cats)
    owner: User;
}
