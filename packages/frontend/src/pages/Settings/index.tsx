import { AttachFileOutlined } from '@mui/icons-material'
import { Avatar, CircularProgress, alpha, styled } from '@mui/material'
import React, { useRef, useState } from 'react'
import {
  useUpdateUserMutation,
  useUploadUserAvatarMutation,
} from 'src/api/index'
import { AppBar } from 'src/components/AppBar'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import Switch from 'src/components/Switch'
import { BUTTON_MAX_WIDTH } from 'src/config/constants'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setTheme } from 'src/store/app'
import { setUser } from 'src/store/auth'
import { Theme } from 'src/types/Theme'

export const ACCEPTED_IMAGE_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

const Content = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  alignItems: 'center',
}))

const SectionTitle = styled('h3')(({ theme }) => ({
  margin: 0,
  fontWeight: 600,
  fontSize: 15,
  color: theme.palette.text.secondary,
  width: '100%',
  maxWidth: `calc(${BUTTON_MAX_WIDTH}px - ${theme.spacing(2)})`,
}))

const Section = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  alignItems: 'center',
  alignSelf: 'stretch',
}))

const OnOffButton = styled('label')(({ theme }) => ({
  padding: theme.spacing(1.25, 2),
  paddingRight: theme.spacing(1.25),
  borderRadius: 100,
  boxShadow: '0 0 0 2px inset ' + alpha(theme.palette.text.primary, 0.12),
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  fontWeight: 500,
  lineHeight: '20px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  ...theme.mixins.button,
  '&:active': {
    transform: 'none',
  },
}))

const UploadButtonRoot = styled('button')(({ theme }) => ({
  ...theme.mixins.button,
  width: '100%',
  boxShadow: '0 0 0 2px inset ' + theme.palette.background.default,
  background: 'transparent',
  borderRadius: '100px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  height: 52,
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  fontWeight: 500,
  padding: theme.spacing(1.25, 2),
  paddingRight: theme.spacing(1.25),
}))

const UploadAvatar: React.FC = () => {
  const $fileInput = useRef<HTMLInputElement>(null)
  const user = useAppSelector((store) => store.auth.user)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '')
  const [uploadUserAvatar, { isLoading }] = useUploadUserAvatarMutation()

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!$fileInput.current) return

    const uploadedFile = e.target.files?.[0]

    if (!uploadedFile) return
    if (!ACCEPTED_IMAGE_FILE_TYPES.some((e) => e === uploadedFile.type)) return

    const newAvatar = new FormData()
    newAvatar.append('file', uploadedFile)
    newAvatar.append('type', uploadedFile.type)
    newAvatar.append('title', uploadedFile.name)
    uploadUserAvatar(newAvatar)
      .unwrap()
      .then((data) => {
        setAvatarUrl(data.avatarUrl)
      })

    $fileInput.current.value = ''
  }

  const handleClick = () => {
    $fileInput.current?.click()
  }

  return (
    <UploadButtonRoot onClick={handleClick}>
      <input
        placeholder="Выбрать файл"
        type="file"
        name="avatar"
        multiple={false}
        onChange={handleChange}
        style={{ display: 'none' }}
        ref={$fileInput}
      />
      {!isLoading && (
        <Avatar
          alt="User avatar"
          sx={{ width: 32, height: 32 }}
          src={avatarUrl}
        >
          {user?.fullname[0]}
        </Avatar>
      )}
      {isLoading && <CircularProgress color="inherit" size={32} />}
      <AttachFileOutlined />
      Загрузить аватарку
    </UploadButtonRoot>
  )
}

const Settings: React.FC = () => {
  const theme = useAppSelector((store) => store.app.theme)
  const user = useAppSelector((store) => store.auth.user)
  const dispatch = useAppDispatch()
  const [fullname, setFullname] = useState(user?.fullname || '')
  const [updateUser, { isLoading }] = useUpdateUserMutation()

  const handleDarkThemeSwitchChange = () => {
    dispatch(setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT))
  }

  const handleUpdateUserClick = () => {
    updateUser({ fullname })
      .unwrap()
      .then((data) => {
        dispatch(setUser(data.user))
      })
  }

  return (
    <>
      <AppBar fixed header="Настройки" />
      <Content>
        <OnOffButton>
          Тёмная тема
          <Switch
            onChange={handleDarkThemeSwitchChange}
            checked={theme === Theme.DARK}
            id="dark-theme-switch"
          />
        </OnOffButton>
        <Section>
          <SectionTitle>Аккаунт</SectionTitle>
          <UploadAvatar />
          <Input
            fullWidth
            disableUnderline
            value={fullname}
            type="fullname"
            placeholder="Имя пользователя"
            onChange={(e) => setFullname(e.target.value)}
          />
          <Button
            disabled={isLoading}
            sx={{ gap: 1 }}
            onClick={handleUpdateUserClick}
          >
            {isLoading && <CircularProgress color="inherit" size={16} />}
            Сохранить
          </Button>
        </Section>
      </Content>
    </>
  )
}

export default Settings
