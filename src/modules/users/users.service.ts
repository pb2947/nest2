import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  private async checkUnique(t: any) {
    const uniqueColumns = ['email', 'username'];
    for (const u of uniqueColumns) {
      const count = await this.repository.count({
        where: t.id
          ? {
              [u]: ILike(t[u]),
              id: Not(t.id),
            }
          : {
              [u]: ILike(t[u]),
            },
      });
      if (count > 0) {
        throw new HttpException(`${u}-taken`, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async create(createUserDto: CreateUserDto) {
    await this.checkUnique(createUserDto);

    const hashedPassword: string = createUserDto.password
      ? await bcrypt.hash(createUserDto.password, 10)
      : null;

    const newUser = await this.repository.insert({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.findOne(newUser.identifiers[0].id);
  }

  findAll() {
    return this.repository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number) {
    const user = await this.repository.findOne({
      where: { id: id },
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.checkUnique({ ...updateUserDto, id });

    await this.repository.update(
      { id: id },
      {
        ...updateUserDto,
      },
    );
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repository.softDelete(id);
    return true;
  }
}
