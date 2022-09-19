import { Avatar, createStyles, Group, Menu, UnstyledButton, Text } from "@mantine/core";
import { IconChevronDown, IconHeart, IconLogout, IconMessage, IconPlayerPause, IconSettings, IconStar, IconSwitchHorizontal, IconTrash } from "@tabler/icons";
import { useState } from "react";
import { auth } from "../lib/firebase";

const useStyles = createStyles((theme) => ({
    links: {
      [theme.fn.smallerThan('sm')]: {
        display: 'none',
      },
    },      
    link: {
      display: 'block',
      lineHeight: 1,
      padding: '8px 12px',
      borderRadius: theme.radius.sm,
      textDecoration: 'none',
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
      fontSize: theme.fontSizes.sm,
      fontWeight: 500,
  
      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      },
    },
    linkLabel: {
      marginRight: 5,
    },
    user: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        borderRadius: theme.radius.sm,
        transition: 'background-color 100ms ease',
    
        '&:hover': {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        },
    
        [theme.fn.smallerThan('xs')]: {
          display: 'none',
        },
      },
    
      userActive: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      },
  }));

export default function UserHeaderButton({ username, user }){
    const { classes, theme, cx } = useStyles();
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    return(
        <>
             <Menu
                width={260}
                position="bottom-end"
                transition="pop-top-right"
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
            >
                <Menu.Target>
                <UnstyledButton
                    className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                >
                    <Group spacing={7}>
                    <Avatar src={user?.photoURL} alt={username} radius="xl" size={20} />
                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                        {username}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5} />
                    </Group>
                </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                <Menu.Item icon={<IconHeart size={14} color={theme.colors.red[6]} stroke={1.5} />}>
                    Liked posts
                </Menu.Item>
                <Menu.Item icon={<IconStar size={14} color={theme.colors.yellow[6]} stroke={1.5} />}>
                    Saved posts
                </Menu.Item>
                <Menu.Item icon={<IconMessage size={14} color={theme.colors.blue[6]} stroke={1.5} />}>
                    Your comments
                </Menu.Item>

                <Menu.Label>Settings</Menu.Label>
                <Menu.Item icon={<IconSettings size={14} stroke={1.5} />}>Account settings</Menu.Item>
                <Menu.Item icon={<IconSwitchHorizontal size={14} stroke={1.5} />}>
                    Change account
                </Menu.Item>
                <Menu.Item onClick={() => auth.signOut()} icon={<IconLogout size={14} stroke={1.5} />}>Logout</Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item icon={<IconPlayerPause size={14} stroke={1.5} />}>
                    Pause subscription
                </Menu.Item>
                <Menu.Item color="red" icon={<IconTrash size={14} stroke={1.5} />}>
                    Delete account
                </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </>
    )
}