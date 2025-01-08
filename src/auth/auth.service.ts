import { BadRequestException, ConflictException, Injectable, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt'
import { loginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { nanoid } from 'nanoid';
import { ResetCode } from './schemas/reset-code.schema';
import { MailService } from 'src/services/mail.service';
import { VerifyCodeDto } from './dto/verfiyCode.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EditProfileDto } from './dto/edit-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Category } from 'src/category/schemas/category.schema';
import { ChangeIconDto } from './dto/change-icon.dto';
import { ConfigService } from '@nestjs/config';
import { ChangeLockDto } from './dto/change-lock.dto';
import { ChangeGemsDTO } from './dto/change-gems.dto';
import { AwardGemsDto } from 'src/auth/dto/buyGems.dto';
import { ShopDto } from './dto/shop.dto';
import { query } from 'express';
import { Shop } from './schemas/shop.schema';
import { AddGemsDto } from './dto/addGems.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectModel(ResetCode.name)
        private ResetCodeModel: Model<ResetCode>,
        private mailService: MailService,
        @InjectModel(Category.name)
        private categoryModel: Model<Category>,
        @InjectModel(Shop.name)
        private shopModel: Model<Shop>
    ) { }

    async signUp(signUpDto: SignUpDto): Promise<{ user, token: string }> {
        const { fullName, email, password, gems, level, levelProgress, icon } = signUpDto;

        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('Email is already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const initializedGems = gems ?? 0;
        const initializedLevel = level ?? 0;
        const initializedLevelProgress = levelProgress ?? 0;

        const allCategories = await this.categoryModel.find().exec();
        const categoriesProgress = allCategories.map((category, index) => ({
            category: category._id,
            progress: 0,
            isLocked: index === 0 ? false : true
        }));

        const user = await this.userModel.create({
            fullName,
            email,
            password: hashedPassword,
            gems: initializedGems,
            level: initializedLevel,
            levelProgress: initializedLevelProgress,
            icon,
            categoriesProgress,
        });

        const token = this.jwtService.sign({ id: user._id });

        return { user, token };
    }

    // Modify the login method
    async login(loginDto: loginDto): Promise<{ payload, token: string }> {
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            gems: user.gems,
            level: user.level,
            icon: user.icon,
            categoryProgress: user.categoriesProgress,
        };

        //const expiresIn = this.configService.get<string>('JWT_EXPIRES', '1d'); // Default to '1d' if undefined
        const token = this.jwtService.sign(payload);

        return { payload, token };
    }

    async forgotPassword(email: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) throw new UnauthorizedException("Invalid Email.");

        const resetCode = Math.floor(100000 + Math.random() * 900000);
        const expiryDate = new Date();
        expiryDate.setSeconds(expiryDate.getMinutes() + 100);

        await this.ResetCodeModel.create({
            codeNumber: resetCode,
            userId: user._id,
            expiryDate,
        });

        await this.mailService.sendPasswordResetEmail(email, resetCode);

        return { message: "Reset code sent to your email.", state: "success" };
    }

    async getResetCodeByEmail(email: string): Promise<ResetCode> {
        const user = await this.userModel.findOne({ email });
        if (!user) throw new NotFoundException('User not found');

        const resetCode = await this.ResetCodeModel.findOne({
            userId: user._id,
            expiryDate: { $gt: new Date() }
        });

        if (!resetCode) throw new NotFoundException('Code not found or expired');
        return resetCode;
    }

    async verifyResetCode(email: string, resetCode: string): Promise<boolean> {
        const user = await this.userModel.findOne({ email });
        if (!user) throw new NotFoundException('User not found');

        const codeRecord = await this.ResetCodeModel.findOne({
            userId: user._id,
            codeNumber: resetCode,
            expiryDate: { $gt: new Date() }
        });

        return !!codeRecord;
    }

    async changePassword(email: string, changePasswordDto: ResetPasswordDto): Promise<void> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await this.userModel.updateOne({ email }, { password: hashedPassword });

    }

    async updateProfile(id: string, editProfileDto: EditProfileDto): Promise<{ user }> {
        const { newName, newEmail } = editProfileDto;

        const findUser = await this.userModel.findById(id);

        if (!findUser) {
            throw new NotFoundException('User not found');
        }

        if (newEmail && newEmail !== findUser.email) {
            const existingUser = await this.userModel.findOne({ email: newEmail });
            if (existingUser) {
                throw new BadRequestException('Email is already exists');
            }
        }

        const updateData: any = {};
        if (newName) {
            updateData.fullName = newName;
        }
        if (newEmail) {
            updateData.email = newEmail;
        }

        const updatedUser = await this.userModel.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { new: true }
        );

        return { user: updatedUser };
    }

    async updatePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<{ user }> {

        const { oldPassword, newPassword } = changePasswordDto;

        const findUser = await this.userModel.findById(id);
        if (!findUser) {
            throw new NotFoundException('User not found');
        }

        //Compare passwords
        const passwordMatch = await bcrypt.compare(oldPassword, findUser.password)
        if (!passwordMatch) {
            throw new NotFoundException('Check your current password');
        }

        //Create new password
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        findUser.password = newHashedPassword;

        await findUser.save()
        const userAfterPasswordUpdate = await this.userModel.findById(id)
        return { user: userAfterPasswordUpdate };

    }

    async getProfile(user: any) {
        const foundUser = await this.userModel
            .findById(user.id)
            .populate('categoriesProgress.category')
            .exec();

        if (!foundUser) {
            throw new NotFoundException('User not found');
        }

        const { password, ...safeUser } = foundUser.toObject();

        return safeUser;
    }

    async updateIcon(id: string, changeIconDto: ChangeIconDto): Promise<{ user }> {

        const { newIcon } = changeIconDto;

        const findUser = await this.userModel.findById(id);
        if (!findUser) {
            throw new NotFoundException('User not found');
        }

        const updateData: any = {};
        if (newIcon) {
            updateData.icon = newIcon;
        }

        const updatedUser = await this.userModel.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { new: true }
        );

        return { user: updatedUser };
    }

    async updateLock(id: string, changeLockDto: ChangeLockDto): Promise<{ user }> {
        const { categoryId, isLockedStatus } = changeLockDto;

        const category = await this.categoryModel.findById(categoryId).exec();
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const categoryProgressIndex = user.categoriesProgress.findIndex(
            (categoryProgress) => categoryProgress.category.toString() === categoryId,
        );

        if (categoryProgressIndex === -1) {
            throw new NotFoundException('Category not found in user progress');
        }

        user.categoriesProgress[categoryProgressIndex].isLocked = isLockedStatus;
        user.gems -= category.catPrice;

        const updatedUser = await user.save();

        return { user: updatedUser };
    }

    async awardGems(userId: string, awardGemsDto: AwardGemsDto): Promise<any> {
        const { correctAnswersCount, expEarned, catProgress, categoryId } = awardGemsDto;

        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const categoryProgressIndex = user.categoriesProgress.findIndex(
            (categoryProgress) => categoryProgress.category.toString() === categoryId,
        );

        const gemsToAward = correctAnswersCount * 10;
        let expToAward = expEarned * 100;
        let catToAward = catProgress * 10;

        user.gems += gemsToAward;
        user.levelProgress = expToAward;
        user.categoriesProgress[categoryProgressIndex].progress = catToAward;

        if (user.levelProgress == 700) {
            user.level++;
            user.levelProgress = 0;
        }

        const updatedUser = await user.save();
        return { user: updatedUser };
    }

    async createShop(shopDto: ShopDto): Promise<any> {
        const createdShop = new this.shopModel(shopDto);
        return createdShop.save();
    }

    async getAllShops(): Promise<Shop[]> {
        return this.shopModel.find().exec();
    }

    async buyGems(userId: string, addGemsDto: AddGemsDto): Promise<any> {
        const { earnedGems } = addGemsDto;

        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const gemsToAward = earnedGems ;

        user.gems += gemsToAward;

        const updatedUser = await user.save();
        return { user: updatedUser };
    }
}