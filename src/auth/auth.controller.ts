import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Put, Request, UseGuards, Headers, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { loginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyCodeDto } from './dto/verfiyCode.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { EditProfileDto } from './dto/edit-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeIconDto } from './dto/change-icon.dto';
import { ChangeLockDto } from './dto/change-lock.dto';
import { ChangeGemsDTO } from './dto/change-gems.dto';
import { AwardGemsDto } from 'src/auth/dto/buyGems.dto';
import { ShopDto } from './dto/shop.dto';
import { Shop } from './schemas/shop.schema';
import Stripe from 'stripe';
import { AddGemsDto } from './dto/addGems.dto';

@Controller('auth')
export class AuthController {
    private stripe: Stripe
    constructor(
        private authService: AuthService
    ) {
        this.stripe = new Stripe('API-KEY', { apiVersion: '2024-12-18.acacia' });
    }

    // User Section
    @Post('/signup')
    signUp(@Body() signUpDto: SignUpDto): Promise<{ user }> {
        return this.authService.signUp(signUpDto)
    }

    @Post('/login')
    login(@Body() loginDto: loginDto): Promise<{ payload }> {
        return this.authService.login(loginDto)
    }

    @Post('/forgot-password')
    forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPassword.email)
    }

    @Post('/get-reset-code/:email')
    async getResetCode(@Param('email') email: string) {
        const resetCode = await this.authService.getResetCodeByEmail(email);
        if (!resetCode) {
            throw new NotFoundException('Code not found');
        }
        return { codeNumber: resetCode.codeNumber.toString() };
    }

    @Post('/verify-reset-code')
    async verifyResetCode(@Body() verifyCodeDto: VerifyCodeDto) {
        const { email, resetCode } = verifyCodeDto;
        const validCode = await this.authService.verifyResetCode(email, resetCode);
        if (!validCode) throw new NotFoundException('Invalid or expired code');
        return { message: 'Code verified successfully' };
    }

    @Put('reset-password/:email')
    async resetPassword(@Param('email') email: string, @Body() changePasswordDto: ResetPasswordDto): Promise<void> {
        return this.authService.changePassword(email, changePasswordDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return this.authService.getProfile(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Put('update-profile')
    async updateProfile(@Request() req, @Body() editProfileDto: EditProfileDto): Promise<{ user }> {
        const userId = req.user.id;
        return this.authService.updateProfile(userId, editProfileDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('change-password')
    async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto): Promise<{ user }> {
        const userId = req.user.id;
        return this.authService.updatePassword(userId, changePasswordDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('update-icon')
    async updateIcon(@Request() req, @Body() changeIconDto: ChangeIconDto): Promise<{ user }> {
        const userId = req.user.id;
        return this.authService.updateIcon(userId, changeIconDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('update-lock')
    async updateCategoryLock(@Request() req, @Body() changeLockDto: ChangeLockDto,): Promise<{ user }> {
        const userId = req.user.id;
        return this.authService.updateLock(userId, changeLockDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('award-gems')
    async awardGems(@Request() req, @Body() awardGemsDto: AwardGemsDto) {
        const userId = req.user.id;
        return this.authService.awardGems(userId, awardGemsDto);
    }

    @Post('addShop')
    async createShop(@Body() shopDto: ShopDto): Promise<Shop> {
        return this.authService.createShop(shopDto);
    }

    @Get('fetchShop')
    async getAllShops(): Promise<Shop[]> {
        return this.authService.getAllShops();
    }

    @Post('create-payment-intent')
    async createPaymentIntent(@Body() body: { amount: number; currency: string }) {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: body.amount,
            currency: body.currency,
            payment_method_types: ['card'],
        });

        return {
            clientSecret: paymentIntent.client_secret,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Put('buyGems')
    async buyGems(@Request() req, @Body() addGemsDto: AddGemsDto) {
        const userId = req.user.id;
        return this.authService.buyGems(userId, addGemsDto);
    }
}