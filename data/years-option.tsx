const currentYear = new Date().getFullYear();
export const yearsOptions =[
         { label: currentYear.toString(), value: currentYear.toString() },
         { label: (currentYear - 1).toString(), value: (currentYear - 1).toString() },
         { label: (currentYear - 2).toString(), value: (currentYear - 2).toString() },
         { label: (currentYear - 3).toString(), value: (currentYear - 3).toString() },
         { label: (currentYear - 4).toString(), value: (currentYear - 4).toString() },
         { label: (currentYear - 5).toString(), value: (currentYear - 5).toString() },
         { label: (currentYear - 6).toString(), value: (currentYear - 6).toString() },
         { label: (currentYear - 7).toString(), value: (currentYear - 7).toString() },
         { label: (currentYear - 8).toString(), value: (currentYear - 8).toString() },
         { label: (currentYear - 9).toString(), value: (currentYear - 9).toString() },
         { label: (currentYear - 10).toString(), value: (currentYear - 10).toString() },
       ]