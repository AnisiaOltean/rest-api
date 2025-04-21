import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Cat } from "src/cats/entities/cat.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number 

    @Column()
    email: string 

    @Column()
    password: string 

    @OneToMany(() => Cat, (cat) => cat.owner)
    cats: Cat[];
}
