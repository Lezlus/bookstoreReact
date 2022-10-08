import { Express } from 'express'
import { User as CustomUser } from '../api/models'

declare global {
  namespace Express {
    interface User extends CustomUser {
      
    }
  }
}

export {}