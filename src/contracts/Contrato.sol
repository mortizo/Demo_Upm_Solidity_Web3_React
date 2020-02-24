pragma solidity  >=0.5.16 <0.7.0;

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
        c = a + b;
        assert(c >= a);
        return c;
    }
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }
    function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
        if (a == 0) {
            return 0;
        }
        c = a * b;
        assert(c / a == b);
        return c;
    }
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b>0);
        return a / b;
    }
}

contract Contrato{
    using SafeMath for uint;

    struct Service {
        uint serviceCode;
        address serviceConstituentAddress;
        string serviceDescription;
    }
    struct Mission {
        uint missionCode;
        string missionDescription;
        uint missionCodeFather;
        address missionConstituentAddress;
    }

    uint private _totalMission;
    mapping(uint => Mission) private missionMap;
    uint private _totalService;
    mapping(uint => Service) private serviceMap;
    
    constructor() public {
        _totalMission = 0;
        _totalService = 0;
    }

    function totalMission() public view returns (uint) {
        return _totalMission;
    }

    function setMission(string memory _missionDescription, uint _missionCodeFather) public {
        _totalMission = _totalMission.add(1);
        missionMap[_totalMission] = Mission(_totalMission, _missionDescription, _missionCodeFather, msg.sender);
    }

    function getMission(uint  _missionCode) public view returns (uint, string memory, uint, address) {
        return (_missionCode, missionMap[_missionCode].missionDescription,
            missionMap[_missionCode].missionCodeFather, missionMap[_missionCode].missionConstituentAddress);
    }
    function totalService() public view returns (uint) {
        return _totalService;
    }

    function setService(string memory _serviceDescription) public {
        _totalService = _totalService.add(1);
        serviceMap[_totalService] = Service(_totalService, msg.sender, _serviceDescription);
    }

    function getService(uint _serviceCode) public view returns (uint, string memory, address) {
        return (_serviceCode, serviceMap[_serviceCode].serviceDescription, serviceMap[_serviceCode].serviceConstituentAddress);
    }



}