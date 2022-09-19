import {
    UnstyledButton,
    UnstyledButtonProps,
    Group,
    Avatar,
    Menu,
    Text,
    createStyles,
  } from '@mantine/core';
  import { IconChevronRight } from '@tabler/icons';
import { useState } from 'react';
import { UserCardImage, UserCardImageProps } from './UserCard';
  
  const useStyles = createStyles((theme) => ({
    user: {
      display: 'block',
      width: '100%',
      padding: theme.spacing.md,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
  
      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
      },
    },
  }));
  
  export interface UserButtonProps extends UnstyledButtonProps {
    image: string;
    name: string;
    email: string;
    icon?: React.ReactNode;
  }
  
  export function UserButton({ image, name, email, icon, ...others }: UserButtonProps) {
    const { classes } = useStyles();
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    const userCardImageProps:UserCardImageProps = {
        image: '/cover-placeholder-image.jpg',
        avatar: image,
        name: name,
        job: 'Test Dev',
        stats: [
            {
                label: 'Followers',
                value: '20300'
            },
            {
                label: 'Follows',
                value: '10'
            },
            {
                label: 'Posts',
                value: '13'
            }
        ],
        menu: userMenuOpened,
        setMenu: setUserMenuOpened
    }
  
    return (
      <>
        <UnstyledButton className={classes.user} {...others} onClick={() => setUserMenuOpened(true)}>
            <Group>
            <Avatar src={image} radius="xl" />
    
            <div style={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                {name}
                </Text>
    
                <Text color="dimmed" size="xs">
                {email}
                </Text>
            </div>
    
            {icon || <IconChevronRight size={14} stroke={1.5} />}
            </Group>
        </UnstyledButton>
          
        <UserCardImage {...userCardImageProps}/>
      </>
    );
  }