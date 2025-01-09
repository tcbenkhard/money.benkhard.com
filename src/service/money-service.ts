import {ProfilesRepository} from "../repository/profiles-repository";
import {CreateProfileRequest, GetProfileRequest, Profile} from "../model/profile";
import {Administration, CreateAdministrationRequest} from "../model/administration";
import {AdministrationRepository} from "../repository/administration-repository";
import {Membership} from "../model/membership";

export class MoneyService {
    constructor(private profilesRepository: ProfilesRepository, private administrationRepository: AdministrationRepository) {}

    async getProfile(request: GetProfileRequest) {
        const profile = await this.profilesRepository.getProfile(request.email)
        console.info(`Found profile for ${request.email}`)
        return profile
    }

    async createProfile(request: CreateProfileRequest) {
        const profile = Profile.fromCreateProfileRequest(request)
        await this.profilesRepository.createProfile(profile)
        console.info(`Created profile for ${request.email}`)
        await this.createAdministration({
            owner: request.email,
            name: `${request.displayName}'s Administration`,
        })
        console.info(`Created administration for ${request.email}`)
        return profile
    }

    async createAdministration(request: CreateAdministrationRequest) {
        const administration = Administration.fromRequest(request)
        const membership = new Membership(administration.id, request.owner, new Date().toISOString(), request.owner, 'OWNER')
        await Promise.all([
            this.administrationRepository.createAdministration(administration),
            this.administrationRepository.createMembership(membership)
        ])
        return administration
    }
}

