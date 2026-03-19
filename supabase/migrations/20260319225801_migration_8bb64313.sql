-- Add INSERT policy for organisations table to allow new organization creation
CREATE POLICY "Anyone can create an organisation during signup"
ON organisations
FOR INSERT
TO public
WITH CHECK (true);

-- Also add a policy to allow authenticated users to insert organisations
-- This is safer and more explicit
DROP POLICY IF EXISTS "Anyone can create an organisation during signup" ON organisations;

CREATE POLICY "Authenticated users can create organisations"
ON organisations
FOR INSERT
TO authenticated
WITH CHECK (true);