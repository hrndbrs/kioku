import { Navigate, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AuthForm, type FormInputProps } from '@/components/shared/AuthForm';
import {
  loginSchema,
  registrationSchema,
  type LoginResponse,
  type LoginSchema,
  type RegistrationSchema,
} from '@/lib/schemas';
import { cn, fetcher } from '@/lib/utils';
import { FetchError } from '@/lib/exceptions';

enum ActiveTab {
  LOGIN,
  REGISTER,
}

const $q = [ActiveTab.LOGIN, ActiveTab.REGISTER] as const;

export default function Auth() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = Number(searchParams.get('q'));

  if (!$q.includes(q)) return <Navigate to="/auth" />;

  const handleSubmit = async (formData: unknown) => {
    try {
      const payload = q
        ? registrationSchema.parse(formData)
        : loginSchema.parse(formData);

      const { access_token } = await fetcher<LoginResponse>([
        q ? '/register' : '/login',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
      ]);

      localStorage.setItem('access_token', access_token);
      toast({
        title: q ? 'You’re in!' : "Let's train hard today as well!",
        description: q
          ? 'Time to stack up some knowledge and flip those cards!'
          : undefined,
      });

      navigate('/');
    } catch (e) {
      if (e instanceof FetchError)
        toast({
          title: e.message,
          variant: 'destructive',
        });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-white p-6">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-600">KIOKU</h1>
          <p className="text-gray-600">Your personal memory companion</p>
        </header>

        <Card>
          <CardHeader className="gap-1">
            <div className="mb-2 flex space-x-2">
              <Button
                className={cn(
                  'flex-1 transition-colors duration-300',
                  q === ActiveTab.LOGIN && 'pointer-events-none',
                )}
                variant={q === ActiveTab.LOGIN ? 'default' : 'outline'}
                onClick={() =>
                  setSearchParams({ q: ActiveTab.LOGIN.toString() })
                }
              >
                Login
              </Button>
              <Button
                className={cn(
                  'flex-1 transition-colors duration-300',
                  q === ActiveTab.REGISTER && 'pointer-events-none',
                )}
                variant={q === ActiveTab.REGISTER ? 'default' : 'outline'}
                onClick={() =>
                  setSearchParams({ q: ActiveTab.REGISTER.toString() })
                }
              >
                Register
              </Button>
            </div>
            <CardTitle>
              {q === ActiveTab.LOGIN ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription>
              {q === ActiveTab.LOGIN
                ? "Let's continue your journey of unlocking super memory"
                : 'Sign up to start boosting your memory'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm inputs={forms[q]} onSubmit={handleSubmit} key={q}>
              <CardFooter className="mt-2 grid gap-2 max-xs:p-0">
                <Button className="w-full rounded-full">
                  {q === ActiveTab.LOGIN
                    ? 'Continue Learning'
                    : 'Start Your Journey'}
                </Button>
                <Link to="/">
                  <Button
                    type="button"
                    className="w-full rounded-full"
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                </Link>
              </CardFooter>
            </AuthForm>
          </CardContent>
        </Card>

        <footer className="mt-8 text-center text-sm text-gray-500">
          &copy; 2024 KIOKU. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

const forms: [
  Record<keyof LoginSchema, FormInputProps>,
  Record<keyof RegistrationSchema, FormInputProps>,
] = [
  {
    email: { label: 'Email', placeholder: 'user@mail.com', type: 'email' },
    password: { label: 'Password', placeholder: 'Password', type: 'password' },
  },
  {
    full_name: { label: 'Full name', placeholder: 'Your Name' },
    email: { label: 'Email', placeholder: 'user@mail.com', type: 'email' },
    password: { label: 'Password', placeholder: 'Password', type: 'password' },
    profile_pic: {
      label: 'Profile picture',
      placeholder: 'https://path/to/image',
    },
  },
] as const;
