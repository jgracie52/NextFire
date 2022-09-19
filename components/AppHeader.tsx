import {
    createStyles,
    Menu,
    Center,
    Header,
    Container,
    useMantineColorScheme,
    Button,
    Group,
    Image,
    ActionIcon,
    Burger,
  } from '@mantine/core';
  import { useState } from 'react';
  import { useDisclosure } from '@mantine/hooks';
  import {
    IconChevronDown,
    IconSun,
    IconMoonStars
  } from '@tabler/icons';
  import { useContext } from 'react';
  import { UserContext } from '../lib/context'
import UserHeaderButton from './UserHeaderButton';
import Link from 'next/link';
  
  const HEADER_HEIGHT = 60;
  
  const useStyles = createStyles((theme) => ({
    inner: {
      height: HEADER_HEIGHT,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  
    links: {
      [theme.fn.smallerThan('sm')]: {
        display: 'none',
      },
    },
  
    burger: {
      [theme.fn.largerThan('sm')]: {
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
  }));
  
  export interface HeaderActionProps {
    links: { link: string; label: string; links: { link: string; label: string }[] }[];
  }
  
  export default function AppHeader({ links }: HeaderActionProps) {
    const { classes, theme, cx } = useStyles();
    const [opened, { toggle }] = useDisclosure(false);
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const {user, username} = useContext(UserContext)
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === "light";

    const items = links.map((link) => {
      const menuItems = link.links?.map((item) => (
        <Menu.Item key={item.link}>{item.label}</Menu.Item>
      ));
  
      if (menuItems) {
        return (
          <Menu key={link.label} trigger="hover" exitTransitionDuration={0}>
            <Menu.Target>
              <a
                href={link.link}
                className={classes.link}
                onClick={(event) => event.preventDefault()}
              >
                <Center>
                  <span className={classes.linkLabel}>{link.label}</span>
                  <IconChevronDown size={12} stroke={1.5} />
                </Center>
              </a>
            </Menu.Target>
            <Menu.Dropdown>{menuItems}</Menu.Dropdown>
          </Menu>
        );
      }
  
      return (
        <a
          key={link.label}
          href={link.link}
          className={classes.link}
        >
          {link.label}
        </a>
      );
    });
  
    return (
      <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0, marginTop: 10 }} mb={40}>
        <Container className={classes.inner} fluid>
          <Group>
            <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
            <Link href="/">
                <Image src={'/logo-no-background.svg'} height={50}/>
            </Link>
          </Group>
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>
          <Group>
                <ActionIcon
                onClick={() => toggleColorScheme()}
                size="lg"
                sx={(theme) => ({
                backgroundColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.primaryColor,
                })}
            >
                {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>
            {user ? 
                <UserHeaderButton user={user} username={username} /> : 
                <Button radius="xl" sx={{ height: 30 }} component="a" href="/enter">
                  Sign In
                </Button>
            }
          </Group>
        </Container>
      </Header>
    );
  }