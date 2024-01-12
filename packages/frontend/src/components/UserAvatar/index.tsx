import { Avatar } from '@mui/material'
import React from 'react'
import { API_URL } from 'src/config/constants'

type UserAvatarProps = {
  avatarUrl?: string
  fullname?: string
}

const UserAvatar: React.FC<UserAvatarProps> = ({ avatarUrl, fullname }) => {
  return (
    <Avatar
      alt="User avatar"
      sx={{ width: 32, height: 32 }}
      src={API_URL + avatarUrl}
    >
      {fullname?.[0]}
    </Avatar>
  )
}

export default UserAvatar
