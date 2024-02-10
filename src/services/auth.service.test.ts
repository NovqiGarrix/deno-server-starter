import env from "@config/env.ts";
import { novo } from "@deps";
import UserModel from "@entity/users.entity.ts";
import VerificationModel from "@entity/verifications.entity.ts";
import { RegisterRequestSchema } from '@models/web/signup.model.ts';
import { signin, verifyEmailOtp } from "@services/auth.service.ts";
import { assertEquals, assertExists, assertFalse, assertStringIncludes } from "@testDeps";
import jwt from "@utils/jwt.ts";
import { faker } from 'npm:@faker-js/faker@8.4.0';
import { generateOtp, getEmailVerificationTemplate, signup } from './auth.service.ts';

function getRandomUser(override?: Partial<RegisterRequestSchema>) {
    const data: RegisterRequestSchema = {
        age: faker.number.int({ min: 20, max: 80 }),
        church: faker.lorem.word(),
        criteria: faker.lorem.word(),
        domicile: faker.lorem.word(),
        education: faker.lorem.word(),
        email: faker.internet.email(),
        gender: faker.person.gender(),
        hope: faker.lorem.word(),
        job: faker.person.jobTitle(),
        name: faker.internet.userName(),
        noWa: faker.phone.number(),
        religion: faker.lorem.word(),
        status: faker.lorem.word(),
        tribe: faker.lorem.word(),
        password: faker.internet.password(),
        photoUrl: faker.image.url(),
        withOAuth: false,
        purchaseProof: faker.image.avatarGitHub(),
    }

    return { ...data, ...override }
}

Deno.test("Generate OTP", () => {
    assertEquals(generateOtp().length, 6);
});

Deno.test("getEmailVerificationTemplate", async () => {

    const otp = "123456";
    const name = "John Doe";

    const template = await getEmailVerificationTemplate(otp, name);

    assertStringIncludes(template, "html");

    assertStringIncludes(template, otp);
    assertStringIncludes(template, name);

});

Deno.test("sign up with send email", async () => {
    try {
        await novo.connect(env.DATABASE_TEST_URL!);
        const data = getRandomUser();

        await signup(data);

        // It should create a new user
        const signedupUser = await UserModel.findOne({ email: data.email });
        assertExists(signedupUser);

        assertEquals(signedupUser.isVerified, false);
        assertEquals(signedupUser.formVerified, false);
        assertEquals(signedupUser.emailVerified, false);

        // It should create a verification data on db
        assertExists(await VerificationModel.findOne({ email: data.email }));
    } catch (error) {
        console.log(error);
        assertFalse(Boolean(error));
    } finally {
        novo.disconnect();
    }
});

Deno.test("sign up with oauth without email given from oauth", async () => {

    try {
        await novo.connect(env.DATABASE_TEST_URL!);
        const data = getRandomUser({
            withOAuth: true,
            oAuthHasEmail: false,
            oAuthProvider: "Github"
        });

        await signup(data);

        // It should create a new user
        const signedupUser = await UserModel.findOne({ email: data.email });
        assertExists(signedupUser);

        assertEquals(signedupUser.isVerified, false);
        assertEquals(signedupUser.formVerified, false);
        assertEquals(signedupUser.emailVerified, false);

        // It should create a verification data on db
        // If it exists that means the API is sending email to the user
        assertExists(await VerificationModel.findOne({ email: data.email }));
    } catch (error) {
        console.log(error);
        assertFalse(Boolean(error));
    } finally {
        novo.disconnect();
    }

});

Deno.test("sign up with oauth with email given from oauth", async () => {

    try {
        await novo.connect(env.DATABASE_TEST_URL!);
        const data = getRandomUser({
            withOAuth: true,
            oAuthHasEmail: true,
            oAuthProvider: "Github"
        });

        await signup(data);

        // It should create a new user
        const signedupUser = await UserModel.findOne({ email: data.email });
        assertExists(signedupUser);

        assertEquals(signedupUser.isVerified, false);
        assertEquals(signedupUser.formVerified, false);
        assertEquals(signedupUser.emailVerified, true);

        // It should not exist because the API is not sending email to the user
        // because the email is already verified 
        // by the oauth provider    
        assertFalse(Boolean(await VerificationModel.findOne({ email: data.email })));
    } catch (error) {
        assertFalse(Boolean(error));
    } finally {
        novo.disconnect();
    }

});

Deno.test("should verify valid otp", async () => {

    try {
        await novo.connect(env.DATABASE_TEST_URL!);
        const data = getRandomUser();

        await signup(data);

        const verification = await VerificationModel.findOne({ email: data.email });
        assertExists(verification);

        const { otp } = jwt.decode(verification!.token);

        await verifyEmailOtp({
            otp,
            email: verification.email,
        });

        const user = await UserModel.findOne({ email: data.email });
        assertExists(user);

        assertEquals(user.emailVerified, true);

        assertEquals(await VerificationModel.findOne({ email: data.email }), undefined);
    } catch (error) {
        console.log(error);
        assertFalse(Boolean(error));
    } finally {
        novo.disconnect();
    }

});

Deno.test("should not log in user if email is not verified", async () => {

    try {
        await novo.connect(env.DATABASE_TEST_URL!);
        const data = getRandomUser();

        await signup(data);

        await signin({ email: data.email, password: data.password! });

    } catch (error) {
        assertExists(error);
    } finally {
        novo.disconnect();
    }

});

Deno.test("should log in user if email is verified", async () => {

    try {
        await novo.connect(env.DATABASE_TEST_URL!);
        const data = getRandomUser();

        await signup(data);

        const verification = await VerificationModel.findOne({ email: data.email });
        assertExists(verification);

        const { otp } = jwt.decode(verification!.token);

        await verifyEmailOtp({
            otp,
            email: verification.email,
        });

        const { token } = await signin({ email: data.email, password: data.password! });
        assertStringIncludes(token, "ey");
    } catch (error) {
        assertFalse(Boolean(error));
    } finally {
        novo.disconnect();
    }

});