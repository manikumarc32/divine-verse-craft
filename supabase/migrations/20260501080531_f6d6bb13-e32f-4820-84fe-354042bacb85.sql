
ALTER TABLE public.india_signups
  ADD CONSTRAINT india_signups_email_len CHECK (char_length(email) BETWEEN 5 AND 320),
  ADD CONSTRAINT india_signups_email_shape CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');

ALTER TABLE public.contact_messages
  ADD CONSTRAINT contact_name_len CHECK (char_length(name) BETWEEN 1 AND 120),
  ADD CONSTRAINT contact_email_len CHECK (char_length(email) BETWEEN 5 AND 320),
  ADD CONSTRAINT contact_subject_len CHECK (subject IS NULL OR char_length(subject) <= 200),
  ADD CONSTRAINT contact_message_len CHECK (char_length(message) BETWEEN 1 AND 4000);
