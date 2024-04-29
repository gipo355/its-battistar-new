// import { CustomResponse } from '@its-battistar/shared-types';
// import { Handler } from 'express';
// import { StatusCodes } from 'http-status-codes';
// import mongoose from 'mongoose';
//
// import { APP_CONFIG as c } from '../../../app.config';
// import { AppError, catchAsync, createJWT } from '../../../utils';
// import { AccountModel } from '../../api/users/accounts.model';
// import { UserModel } from '../../api/users/users.model';
//
// export const signupHandler: Handler = catchAsync(async (req, res) => {
//   const { email, password, passwordConfirm } = req.body as {
//     email: string | undefined;
//     password: string | undefined;
//     passwordConfirm: string | undefined;
//   };
//
//   // TODO: validate email and password in mongoose schema or ajv
//   if (!email || !password || !passwordConfirm) {
//     throw new AppError(
//       'Email, password and password confirmations are required',
//       StatusCodes.BAD_REQUEST
//     );
//   }
//
//   /**
//    * do an upsert if a local account does not exist
//    */
//   // const user = await UserModel.findOneAndUpdate(
//   //   { email },
//   //   {
//   //     $setOnInsert: {
//   //       email,
//   //       accounts: [
//   //         {
//   //           strategy: 'LOCAL',
//   //           password,
//   //           passwordConfirm,
//   //         },
//   //       ],
//   //     },
//   //   },
//   //   {
//   //     upsert: true,
//   //     new: true,
//   //   }
//   // );
//   /**
//    * we need to use a transaction to ensure that the user is created only if there is no user with the same email
//    */
//
//   const session = await mongoose.startSession();
//   await session.withTransaction(async () => {
//     /**
//      * my objectives:
//      * if there is a user with a local account, throw an error
//      * if there is no user at all, create a new user with a local account
//      * if there is a user but no local account, create a local account for the user
//      */
//     const transactionUser = await UserModel.findOne(
//       { email },
//       {
//         accounts: true,
//       }
//     ).session(session);
//
//     if (!transactionUser) {
//       await UserModel.create(
//         {
//           email,
//           accounts: [
//             {
//               strategy: 'LOCAL',
//               password,
//               passwordConfirm,
//             },
//           ],
//         },
//         { session }
//       );
//       return;
//     }
//
//     if (
//       transactionUser.accounts.some(
//         (account) => account.strategy === 'LOCAL' && account.password
//       )
//     ) {
//       // VULNERABILITY: brute force attack, leaking user existence
//       throw new AppError('User already exists', StatusCodes.CONFLICT);
//     }
//
//     await AccountModel.create(
//       [
//         {
//           user: transactionUser._id,
//           strategy: 'LOCAL',
//           password,
//           passwordConfirm,
//         },
//       ],
//       { session }
//     );
//
//     await transactionUser.save({ session });
//   });
//
//   await session.endSession();
//
//   const user = await UserModel.findOne({
//     email,
//   }).select('+accounts.password +accounts.passwordConfirm');
//
//   if (!user) {
//     throw new AppError(
//       'There was a problem creating the user',
//       StatusCodes.CONFLICT
//     );
//   }
//
//   const accessToken = await createJWT({
//     data: {
//       user: user._id.toString(),
//       strategy: 'LOCAL',
//     },
//     type: 'access',
//   });
//   const refreshToken = await createJWT({
//     data: {
//       user: user._id.toString(),
//       strategy: 'LOCAL',
//     },
//     type: 'refresh',
//   });
//
//   res.cookie('accessToken', accessToken, c.JWT_ACCESS_COOKIE_OPTIONS);
//   res.cookie('refreshToken', refreshToken, c.JWT_REFRESH_COOKIE_OPTIONS);
//
//   res.status(StatusCodes.OK).json(
//     new CustomResponse<{
//       accessToken: string;
//       refreshToken: string;
//       userId: string;
//     }>({
//       ok: true,
//       statusCode: StatusCodes.CREATED,
//       message: 'Registered successfully',
//       data: {
//         accessToken,
//         refreshToken,
//         userId: user._id.toString(),
//       },
//     })
//   );
// });
