import { createFileRoute } from '@tanstack/react-router'
import RafflesPage from './raffles/index' 

export const Route = createFileRoute('/')({
  component: RafflesPage,
})
