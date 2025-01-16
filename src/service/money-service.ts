import {ProfilesRepository} from "../repository/profiles-repository";
import {CreateProfileRequest, GetProfileRequest, Profile} from "../model/profile";
import {Administration, CreateAdministrationRequest, ListAdministrationsRequest} from "../model/administration";
import {AdministrationRepository} from "../repository/administration-repository";
import {Membership, MembershipRole} from "../model/membership";
import {InvitationRequest, CreateInvitationRequest, Invitation} from "../model/invitation";
import {CreateGroupRequest, GetGroupsRequest, Group} from "../model/group";

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
        const membership = new Membership(administration.id, request.owner, new Date().toISOString(), request.owner, MembershipRole.OWNER)
        await Promise.all([
            this.administrationRepository.createAdministration(administration),
            this.administrationRepository.createMembership(membership)
        ])
        return administration
    }

    async listAdministrationsForUser(request: ListAdministrationsRequest) {
        return await this.administrationRepository.listAdministrationsForEmail(request.email)
    }

    async inviteUserToAdministration(request: CreateInvitationRequest) {
        const invitation = Invitation.fromRequest(request)
        await this.administrationRepository.createInvitation(invitation)
    }

    async acceptInvitation(request: InvitationRequest) {
        const invitation = await this.administrationRepository.getInvitation(request.user, request.administration)
        const membership = invitation.toMembership()
        await Promise.all([
            this.administrationRepository.createMembership(membership),
            this.administrationRepository.removeInvitation(invitation)
        ])
    }

    async declineInvitation(request: InvitationRequest) {
        const invitation = await this.administrationRepository.getInvitation(request.user, request.administration)
        await this.administrationRepository.removeInvitation(invitation)
    }

    async createGroup(request: CreateGroupRequest) {
        const group = Group.fromRequest(request)
        await this.administrationRepository.createGroup(group)
        return group
    }

    async getGroups(request: GetGroupsRequest) {
        return this.administrationRepository.listGroupsForAdministration(request.administrationId)
    }
}

