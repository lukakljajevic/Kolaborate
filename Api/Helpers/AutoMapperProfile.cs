using Api.Helpers.DTOs;
using Api.Helpers.DTOs.Issue;
using Api.Helpers.DTOs.User;
using Api.Models;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Project
            CreateMap<ProjectCreateDto, Project>();
            CreateMap<Project, ProjectListItemDto>();
            CreateMap<Project, ProjectDetailDto>();
            CreateMap<ProjectUser, ProjectUserDto>();
            CreateMap<ProjectInviteDto, ProjectUser>();

            // Phase
            CreateMap<PhaseCreateDto, Phase>();
            CreateMap<Phase, PhaseDetailDto>();
            CreateMap<Phase, PhaseListItemDto>();
            
            // Issue
            CreateMap<IssueCreateDto, Issue>()
                .ForMember(i => i.IssuedTo, opt => opt.Ignore());
            CreateMap<Issue, IssueListItemDto>()
                .ForMember(li => li.Labels, opt => opt.MapFrom(iss => iss.IssueLabels.Select(il => il.Label).ToList()))
                .ForMember(li => li.Project, opt => opt.MapFrom(iss => iss.Phase.Project))
                .ForMember(li => li.IssuedToUserIds, opt => opt.MapFrom(iss => iss.IssuedTo.Select(x => x.UserId).ToList()));
            CreateMap<IssueUser, IssueUserListItemDto>();
            CreateMap<IssueUser, IssueUserDetailDto>();
            CreateMap<Issue, IssueDetailDto>()
                .ForMember(li => li.Labels, opt => opt.MapFrom(iss => iss.IssueLabels.Select(il => il.Label).ToList()));
            CreateMap<IssueUser, UserDto>()
                .ForMember(dto => dto.Id, opt => opt.MapFrom(iu => iu.UserId))
                .ForMember(dto => dto.Username, opt => opt.MapFrom(iu => iu.User.Username))
                .ForMember(dto => dto.FullName, opt => opt.MapFrom(iu => iu.User.FullName))
                .ForMember(dto => dto.Avatar, opt => opt.MapFrom(iu => iu.User.Avatar));

            // Label
            CreateMap<Label, LabelDto>();

            // User
            CreateMap<User, UserDto>();
            CreateMap<UserCreateDto, User>();
        }
    }
}
