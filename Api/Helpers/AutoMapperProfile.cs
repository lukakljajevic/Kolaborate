using Api.Helpers.DTOs;
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
            CreateMap<ProjectCreateDto, Project>();
            CreateMap<Project, ProjectListItemDto>();
            CreateMap<Project, ProjectDetailDto>();
            CreateMap<PhaseCreateDto, Phase>();
            CreateMap<Phase, PhaseListItemDto>();
            CreateMap<IssueCreateDto, Issue>()
                .ForMember(i => i.IssuedTo, opt => opt.Ignore());
            CreateMap<Issue, IssueListItemDto>()
                .ForMember(li => li.Labels, opt => opt.MapFrom(iss => iss.IssueLabels.Select(il => il.Label).ToList()))
                .ForMember(li => li.Project, opt => opt.MapFrom(iss => iss.Phase.Project))
                .ForMember(li => li.IssuedToUserIds, opt => opt.MapFrom(iss => iss.IssuedTo.Select(x => x.UserId).ToList()));
            CreateMap<Label, LabelDto>();
            CreateMap<ProjectUser, ProjectUserListItemDto>();
            CreateMap<IssueUser, IssueUserListItemDto>();
            CreateMap<Issue, IssueDetailDto>()
                .ForMember(li => li.Labels, opt => opt.MapFrom(iss => iss.IssueLabels.Select(il => il.Label).ToList()))
                .ForMember(li => li.Project, opt => opt.MapFrom(iss => iss.Phase.Project))
                .ForMember(dto => dto.IssuedTo, opt => opt.MapFrom(i => i.IssuedTo.Select(iu => iu.UserId).ToList()));

        }
    }
}
