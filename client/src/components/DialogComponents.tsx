import { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { DropdownMenuItem } from './ui/dropdown-menu'


interface ContentInterface {
  children: ReactNode
  title: string
  description: string
}

interface TriggerInterface {
  setModal: Dispatch<SetStateAction<string>>
  modal: string
  icon: ReactNode
  title: string
}

const Component: FC<ContentInterface> = ({ children, title, description }) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle> {title} </DialogTitle>
        <DialogDescription> {description} </DialogDescription>
      </DialogHeader>
      { children }
    </DialogContent>
  )
}


const Trigger: FC<TriggerInterface> = ({ setModal, modal, icon, title }) => {
  return (
    <DialogTrigger asChild onClick={() => setModal(modal)}>
      <DropdownMenuItem className='flex items-center gap-x-2 cursor-pointer'>
        {icon}
        {title}
      </DropdownMenuItem>
    </DialogTrigger>
  )
}

export { Component, Trigger }