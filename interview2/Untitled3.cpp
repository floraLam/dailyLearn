#include<stdio.h>
#include<stdlib.h>
#include<string.h>
int main()
{
    int num = 0;
    int n;
    char str[100];
    int a[100];
    printf("input the number:");
    scanf("%d",&num); //数字
    printf("\ninput times:");
    scanf("%d",&n); //个数
    itoa(num, str, 10); //转换为字符串
    int flag=0; //是否是递增序列
    int i; 
    int length=strlen(str); //长度
    int x=length-n;
    while(length!=x){
        flag=0; //递增
        for(i=0;i<length-1;i++){
           if(str[i]>str[i+1]) //比后一个数大 删掉 
           {
                for(int temp=i;temp<length-1;temp++)
                {
                    str[temp]=str[temp+1]; //覆盖
                } 
                length--;
                flag=1; //非递增   
           } 
        }      
        if(flag==0){
            length--;//递增序列  删除最后一个   
        }                        
    }
     
    int tempFlag=0;
   
    for(int i=0;i<length;i++){
        if(tempFlag==1)
            tempFlag=0;
        else
            printf("%c",str[i]);
    }
  
}
