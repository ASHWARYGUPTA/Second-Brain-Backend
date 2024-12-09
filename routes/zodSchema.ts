import z from "zod";
import { ContentTypes } from "./ConstsEnums";

const ConstsEnums = z.nativeEnum(ContentTypes);
type ConstsEnumsTypes = z.infer<typeof ConstsEnums>;

const UserSignInZod = z.object({
    username:z.string().min(1,"username can't be empty").max(40,"username can't be of more than 40 words"),
    password:z.string().min(8,"Password must be atleast 8 characters").optional(),
    name:z.string().min(1),
    email:z.string().email(),
    age:z.number().min(1).optional()
})

const ContentPostZod = z.object({
    type: z.string(),
	link: z.string().url(),
	title: z.string(),
	tags: z.string(),
    userId: z.string()
})

type UserSignInZodType = z.infer<typeof UserSignInZod>
type UserLoginZodType = Pick<UserSignInZodType,"username"|"password">
type ContentPostZodType = z.infer<typeof ContentPostZod>;

export {UserSignInZod}


