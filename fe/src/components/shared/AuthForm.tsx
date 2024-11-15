import {
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
  type ChangeEvent,
  ReactElement,
} from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { z } from 'zod';

export interface FormInputProps extends ComponentProps<'input'> {
  label?: string;
}

export type FormProps<T extends string[]> = ComponentProps<'form'> & {
  action: ReactNode | ReactElement;
  onSubmit: (data: { [K in T[number]]: string }) => void;
  inputs: {
    [K in T[number]]: FormInputProps;
  };
};

export function AuthForm<T extends z.Schema<any, any>>({
  children,
  onSubmit,
  inputs,
  className,
  ...props
}: ComponentProps<'form'> & {
  onSubmit: (data: Record<keyof typeof inputs, string>) => void;
  inputs: Record<keyof z.TypeOf<T>, FormInputProps>;
}) {
  const inputKeys: (keyof z.TypeOf<T>)[] = useMemo(
    () => Object.keys(inputs),
    [inputs],
  );
  const [formData, setFormData] = useState(
    () =>
      Object.fromEntries(inputKeys.map((k) => [k, ''])) as Record<
        keyof z.TypeOf<T>,
        string
      >,
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <form
      className={cn('space-y-4', className)}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      {...props}
    >
      {inputKeys.map((name) => {
        const { label, type, ...props } = inputs[name];
        return (
          <div className="space-y-2" key={name.toString()}>
            {label ? <Label htmlFor={name.toString()}>{label}</Label> : null}
            <Input
              id={name.toString()}
              name={name.toString()}
              type={type ?? 'text'}
              onChange={handleChange}
              {...props}
            />
          </div>
        );
      })}
      {children}
    </form>
  );
}
