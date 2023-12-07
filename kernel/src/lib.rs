// Build with cargo build --target aarch64-unknown-none
#![no_std]
#![no_main]

const HEAP_BASE: usize = 0xA0000;
const MMIO_BASE: usize = 0x1000;

use core::panic::PanicInfo;
extern crate alloc;
use alloc::format;
use core::alloc::{GlobalAlloc, Layout};
use core::ptr;

#[no_mangle]
extern "C" fn evt(i: i32) -> i32 {
    i + 1
}

fn print_string(msg: &str) {
    let addr = MMIO_BASE as *mut u8;
    for byte in msg.bytes() {
        unsafe { core::ptr::write_volatile(addr, byte); }
    }
}

#[no_mangle]
extern "C" fn kernel_main() {
    let str = format!("Hello world!");
    print_string(&str);
}

#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    unimplemented!()
}



#[global_allocator]
static ALLOCATOR: WarmAlloc = WarmAlloc;

struct WarmAlloc;

static mut NEXT_ALLOC: usize = HEAP_BASE;

unsafe impl GlobalAlloc for WarmAlloc {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        let size = layout.size();
        //let align = layout.align();
        //let align_mask_to_round_down = !(align - 1);

        let ret = NEXT_ALLOC as *mut u8;

        let align = 0x100;
        let align_mask = align - 1;
        let next_addr = (NEXT_ALLOC + size + align) & align_mask;
        NEXT_ALLOC = next_addr;
        ret
    }

    unsafe fn dealloc(&self, ptr: *mut u8, _layout: Layout) {
        // TODO
    }
}