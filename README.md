# 499dao

dao

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org

### API
##### get project list
* GET /api/project/list
* params
```
pageindex = 1
pagesize = 10
```

##### get project detail
* GET /api/project/item
* params: 
下面两个参数任选一个，可以通过token合约地址或者id获取项目详情
```
id,
address,
```

##### upload file
* POST /api/uploadfile
* data-type: form-data
* file
* return
```
{
    "IpfsHash": "QmWDmdgxvqp6yamajvKQvneK2i1ZanLdSFxUZELK1XSgWb",
    "PinSize": 430509,
    "Timestamp": "2020-09-26T10:11:59.444Z"
}
```

##### create project
* POST /api/project/create
```
{
	"baseInfo": {
		"blockchain": "ethereum", // 默认 ethereum
		"name": "YFII",
		"logo": "http://xxx/xxx",
		"brief": "流动性聚合协议",
		"intro": "流动性聚合协议balabala",
		"contract_address": "0xa1d0e215a23d7030842fc67ce582a6afa3ccab83",
		"contract_totalsupply": "2100000",
		"contract_audit": "YFII社区审计+安比实验室审计",
		"contract_audit_report": "https://yfii.finance",
		"website": "https://yfii.finance",
		"sort": 0
	},
	"miningInfo": [
		{
			"symbol": "YFII-ETH LP",
			"url": "xxxx123",
			"amount": "100000"
		}
	],
	"resourceInfo": [
		{
			"name": "twitter",
			"url": "xxxtwitter/xdfs"
		}
	]
}
```
##### update project
* POST /api/project/update
* body
```
{
	"baseInfo": {
	    "id": 1,
	    "intro": "test2",
	    "sort": 2
	},
	"miningInfo": [
        {
            "symbol": "DACC-LP",
            "url": "https://www.myrose.finance/",
            "amount": "100000"
        }
	],
	"resourceInfo": [
        {
            "pid": 1,
            "name": "twitter",
            "url": "https://twitter.com/DACCblockchain"
        },
        {
            "pid": 1,
            "name": "discord",
            "url": "https://discord.com/DACCblockchain"
        }
	]
}
```

##### update project [废弃]
* POST /api/project/update
* body
⚠️ baseInfo对象需要有项目的id
⚠️ miningInfo和resourceInfo中，删除需要添加delete=true，更新需要有id，插入不需要id
```
{
	"baseInfo": {
	    "id": 1,
	    "intro": "test2",
	    "sort": 2
	},
	"miningInfo": [
        {
            "symbol": "DACC-LP",
            "url": "https://www.myrose.finance/",
            "amount": "100000"
        }
		
	],
	"resourceInfo": [
        // 修改id为1的行
        {
            "id": 1,
            "pid": 1,
            "name": "twitter",
            "url": "https://twitter.com/DACCblockchain"
        },
        // 插入一个行
        {
            "pid": 1,
            "name": "twitter",
            "url": "https://twitter.com/DACCblockchain"
        },
        // 删除id为5的行
        {
        	"delete": true,
        	"id": 5,
            "pid": 1,
            "name": "telegram",
            "url": "https://telegram.lm/123/"
        }
	]
}
```