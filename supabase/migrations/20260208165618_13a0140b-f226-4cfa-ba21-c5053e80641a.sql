-- Allow admins to delete subscriptions (revoke access)
CREATE POLICY "Admins can delete subscriptions"
ON public.subscriptions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete profiles (remove users)
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));