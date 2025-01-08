import {ProfilesRepository} from "../repository/profiles-repository";
import {CreateProfileRequest, GetProfileRequest, Profile} from "../model/profile";

export class MoneyService {
    constructor(private moneyRepository: ProfilesRepository) {}

    async getProfile(request: GetProfileRequest) {
        const profile = await this.moneyRepository.getProfile(request.email)
        console.info(`Found profile for ${request.email}`)
        return profile
    }

    async createProfile(request: CreateProfileRequest) {
        const profile = Profile.fromCreateProfileRequest(request)
        await this.moneyRepository.createProfile(profile)
        console.info(`Created profile for ${request.email}`)
        return profile
    }

}

