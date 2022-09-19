import { UnstyledButton, Checkbox, Text, createStyles } from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';
import { useRef } from 'react';

const useStyles = createStyles((theme) => ({
  button: {
    display: 'flex',
    width: '100%',
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3]
    }`,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.lg,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
    },
  },
}));

export interface CheckboxCardProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?(checked: boolean): void;
  title: React.ReactNode;
  description: React.ReactNode;
  register:any,
  registerTag:string
}

export function CheckboxCard({
  checked,
  defaultChecked,
  onChange,
  title,
  description,
  className,
  register,
  registerTag,
  ...others
}: CheckboxCardProps & Omit<React.ComponentPropsWithoutRef<'button'>, keyof CheckboxCardProps>) {
  const { classes, cx } = useStyles();

  const [value, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,
    onChange,
  });
  const checkBoxRef = useRef(null);

  return (
    <UnstyledButton
      {...others}
      // onClick={(e) => checkBoxRef.current.click()}
      className={cx(classes.button, className)}
      
    >
      <Checkbox
        {...register(registerTag)}
        tabIndex={-1}
        size="md"
        mr="xl"
        // ref={checkBoxRef}
        styles={{ input: { cursor: 'pointer' } }}
      />

      <div>
        <Text weight={500} mb={7} sx={{ lineHeight: 1 }}>
          {title}
        </Text>
        <Text size="sm" color="dimmed">
          {description}
        </Text>
      </div>
    </UnstyledButton>
  );
}