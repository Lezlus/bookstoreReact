import chai from 'chai';
import sinonChai from 'sinon-chai';
import request from 'supertest';
import { server } from '../server';
import { createUserSchema, CreateUserType, 
  WishListSchemaType, CreateCartType, FavoriteSchemaType } from '../api/schema/index';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

chai.use(sinonChai);
const expect = chai.expect

const updateUserSchema = z.object({
  first_name: z.string({required_error: 'First name required'}).min(1),
  last_name: z.string({required_error: 'Last name required'}).min(1)
}).strict();

type InvalidUser = {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}

type Wishlist = {
  wishlist: WishListSchemaType
}

type Cart = {
  cart: CreateCartType
}

type Favorite = {
  favorite: FavoriteSchemaType
}

type FullUser = CreateUserType & Cart & Wishlist & Favorite;

class TestUsers {
  users: (CreateUserType | FullUser)[];

  constructor() {
    this.users = [];
  }

  createUser(user: object): CreateUserType | Error {
    let safeUser = createUserSchema.safeParse(user);
    if (!safeUser.success) {
      return new Error('Validation Error')
    } else {
      if (this.getUser(safeUser.data.username)) {
        return new Error('Username is already taken')
      } else {
        this.users.push(safeUser.data);
        return safeUser.data
      }
    }
  }

  createFullUser(user: Object): FullUser {
    let safeUserParse = createUserSchema.safeParse(user);
    if (!safeUserParse.success) {
      throw new Error('Validation Error')
    } else {
      let safeUser: CreateUserType = safeUserParse.data;

      let cart: CreateCartType = {
        total: '0.00',
        id: uuidv4(),
        user_id: safeUser.id,
      }

      let wishlist: WishListSchemaType = {
        id: uuidv4(),
        name: 'default',
        user_id: safeUser.id
      }

      let favorite: FavoriteSchemaType = {
        id: uuidv4(),
        user_id: safeUser.id
      }
      
      let fullUser: FullUser = {
        id: safeUser.id,
        username: safeUser.username,
        password: safeUser.password,
        first_name: safeUser.first_name,
        last_name: safeUser.last_name,
        cart,
        wishlist,
        favorite
      }
      this.users.push(fullUser);
      return fullUser;
    }
  }

  getUser(username: string): CreateUserType | FullUser | undefined {
    let user = this.users.find(user => username === user.username);
    return user;
  }

  getUserById(id: string): CreateUserType | FullUser | undefined {
    let user = this.users.find(user => id === user.id);
    return user;
  }

  updateUser(username: string, updatedUser: object): CreateUserType | Error {
    let oldUser = this.getUser(username);
    if (oldUser) {
      let validUpdatedUser = updateUserSchema.safeParse(updatedUser);
      if (validUpdatedUser.success) {
        let oldUserIndex = this.users.findIndex((user) => user.username === username);
        this.users.splice(oldUserIndex, 1);
      
        oldUser.first_name = validUpdatedUser.data.first_name;
        oldUser.last_name = validUpdatedUser.data.last_name;
  
        this.users.push(oldUser);
        return oldUser;
      } else {
        return new Error('Updated User Props not valid')
      }
    } else {
      return new Error('User not found')
    }
  }

  deleteUser(username: string) {
    let oldUserIndex = this.users.findIndex((user) => user.username === username);
    if (oldUserIndex > -1) {
      this.users.splice(oldUserIndex, 1);
    }
  }

  clearData() {
    this.users = [];
  }

  getSize(): number {
    return this.users.length;
  }

}

const testUsersApp = new TestUsers();

describe('User', () => {
  beforeEach(() => {
    testUsersApp.clearData();
  })

  describe('Creating user', () => {
    it('Post /user', async () => {
      let user: CreateUserType = {
        id: uuidv4(),
        username: 'Lezlus',
        password: 'RAFster2009',
        first_name: 'Rafael',
        last_name: 'B'
      }

      let validatedUser = testUsersApp.createUser(user);
  
      expect(validatedUser).to.deep.equal(user);
    })

    it('Post /user Invalid User should result in an Error ', () => {

      let user: InvalidUser = {
        id: 2,
        username: 'Rafael',
        password: 'Some123',
        first_name: 'Lexlus',
        last_name: 'b'
      }

      let invalidUser = testUsersApp.createUser(user);

      expect(invalidUser).to.be.an.instanceOf(Error);

    })

    it('Post /user If username taken then Error is returned', () => {
      let user: CreateUserType = {
        id: uuidv4(),
        username: 'Lezlus',
        password: 'SomePass',
        first_name: 'Raf',
        last_name: 'B'
      }
      
      let userCopy: CreateUserType = {
        id: uuidv4(),
        username: 'Lezlus',
        password: 'Somepass',
        first_name: 'Raf',
        last_name: 'b'
      }

      testUsersApp.createUser(user);
      let userErr = testUsersApp.createUser(userCopy)

      expect(userErr).to.be.an.instanceOf(Error);
    })

    it('Post /user FullUser should have props cart, favorite, and wishlist', () => {
      let user: CreateUserType = {
        id: uuidv4(),
        username: 'RafsterGamester',
        password: '123Raf',
        first_name: 'Rafael',
        last_name: 'Bravo'
      }

      let validatedFullUser = testUsersApp.createFullUser(user);

      expect(validatedFullUser).to.have.property('wishlist');
      expect(validatedFullUser).to.have.property('cart');
      expect(validatedFullUser).to.have.property('favorite');

    })

    it("Post /user User's props should have user_id === user.id", () => {
      let user: CreateUserType = {
        id: uuidv4(),
        username: 'RafsterGamester',
        password: '123Raf',
        first_name: 'Rafael',
        last_name: 'Bravo'
      }

      let validatedFullUser = testUsersApp.createFullUser(user);
      let cart = validatedFullUser.cart;
      let wishlist = validatedFullUser.wishlist;
      let favorite = validatedFullUser.favorite;

      expect(cart.user_id).to.equal(user.id);
      expect(wishlist.user_id).to.equal(user.id);
      expect(favorite.user_id).to.equal(user.id);
    })
  })
  
  describe('Reading user', () => {
    it('get /user Should get user by unique identifier username', () => {
      let user: CreateUserType = {
        id: uuidv4(),
        username: 'Lezlus',
        password: 'Rafster123',
        first_name: 'Rafael',
        last_name: 'Bravo'
      }

      testUsersApp.createUser(user)

      let foundUser = testUsersApp.getUser(user.username);

      expect(foundUser).to.deep.equal(user);
    })

    it('get /user Get User by unique identifier id', () => {
      let user: CreateUserType = {
        id: uuidv4(),
        username: 'RafsterStar',
        password: 'somePassword',
        first_name: 'Alex',
        last_name: 'Cull'
      }

      testUsersApp.createUser(user);
      let foundUser = testUsersApp.getUserById(user.id);
  
      expect(foundUser).to.deep.equal(user);
    })

    it("get /user Getting user that doesn't exist results in undefined", () => {
      let user: CreateUserType = {
        id: uuidv4(),
        username: 'RafsterStar',
        password: 'somePassword',
        first_name: 'Alex',
        last_name: 'Cull'
      }

      testUsersApp.createUser(user);
      let foundUserById = testUsersApp.getUserById(uuidv4());
      let foundUserByUsername = testUsersApp.getUser('SomeRandomUserName');

      expect(foundUserById).to.be.undefined;
      expect(foundUserByUsername).to.be.undefined;
    })

    it('get /user Getting User has properties cart, wishlist, and favorite', () => {
      let user: CreateUserType = {
        id: uuidv4(),
        username: 'RafsterStar',
        password: 'somePassword',
        first_name: 'Alex',
        last_name: 'Cull'
      }

      testUsersApp.createFullUser(user);
      let fullUser = testUsersApp.getUserById(user.id);

      expect(fullUser).to.have.property('cart');
      expect(fullUser).to.have.property('wishlist');
      expect(fullUser).to.have.property('favorite');
    })
  })

  describe('Updating user', () => {
    it('Put /user Updates a User to have new props first and last name', () => {
      let updatedData = {
        first_name: 'OtherName',
        last_name: 'Other lastName'
      }

      let user: CreateUserType = {
        id: uuidv4(),
        username: 'Raf',
        first_name: 'Rafael',
        last_name: 'Bravo',
        password: 'Pass123'
      }

      testUsersApp.createUser(user);
      let updatedUser = testUsersApp.updateUser(user.username, updatedData);
      
      expect(updatedUser).to.have.property('first_name', updatedData.first_name);
      expect(updatedUser).to.have.property('last_name', updatedData.last_name);
    })

    it('Put /user Updating a User with the wrong props results in an Error', () => {
      let updatedData = {
        password: 'NewPass',
        first_name: 'OtherName',
        last_name: 'OtherLastName'
      }

      let user: CreateUserType = {
        id: uuidv4(),
        username: 'Raf',
        first_name: 'Rafael',
        last_name: 'Bravo',
        password: 'Pass123'
      }

      testUsersApp.createUser(user)
      let userErr = testUsersApp.updateUser(user.username, updatedData);

      expect(userErr).to.be.an.instanceof(Error);
    })

    it('Put /user Updating a user that doesnt exist results in an Error', () => {
      let updatedData = {
        first_name: 'OtherName',
        last_name: 'OtherLastName'
      }

      let user: CreateUserType = {
        id: uuidv4(),
        username: 'Raf',
        first_name: 'Rafael',
        last_name: 'Bravo',
        password: 'Pass123'
      }

      testUsersApp.createUser(user);
      let userErr = testUsersApp.updateUser('UserDoesNotExist', updatedData);

      expect(userErr).to.be.an.instanceof(Error);
    })
  })

  describe('Deleting user', () => {
    it('Delete /user Deleting a User and then retrieving results in undefined', () => {
      let user: CreateUserType = {
        id: uuidv4(),
        username: 'RafsterStar',
        password: 'somePassword',
        first_name: 'Alex',
        last_name: 'Cull'
      }

      testUsersApp.createUser(user);
      testUsersApp.deleteUser(user.username);

      let noUser = testUsersApp.getUser(user.username);
      
      expect(noUser).to.be.undefined;
    })

    it ('Delete /user Deleting a user results in a populated users[] size - 1', () => {
      let user1: CreateUserType = {
        id: uuidv4(),
        username: 'RafsterStar',
        password: 'somePassword',
        first_name: 'Alex',
        last_name: 'Cull'
      }

      let user2: CreateUserType = {
        id: uuidv4(),
        username: 'Lezlus',
        password: 'somePassword',
        first_name: 'Alex',
        last_name: 'Cull'
      }

      let user3: CreateUserType = {
        id: uuidv4(),
        username: 'PatrickStar',
        password: 'somePassword',
        first_name: 'Alex',
        last_name: 'Cull'
      }

      let users: CreateUserType[] = [user1, user2, user3];
      for (let user of users) {
        testUsersApp.createUser(user);
      }

      let oldSize = testUsersApp.getSize();
      testUsersApp.deleteUser(user2.username);
      let size = testUsersApp.getSize();

      expect(size).to.equal(oldSize - 1);
    })

    it('Delete /user Deleting a User with an incorrect \
      identifier results in the user not being deleted', () => {
        let user1: CreateUserType = {
          id: uuidv4(),
          username: 'RafsterStar',
          password: 'somePassword',
          first_name: 'Alex',
          last_name: 'Cull'
        }

        testUsersApp.createUser(user1);
        testUsersApp.deleteUser(user1.username + 'typo');

        let userFound = testUsersApp.getUser(user1.username);
        
        expect(userFound).to.deep.equal(user1);
      })
  })
})